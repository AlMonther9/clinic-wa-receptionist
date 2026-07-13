import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'

/**
 * GET Method: Intercept and process Meta Webhook Verification.
 * Verifies with hub.mode === 'subscribe' and compares hub.verify_token.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const verifyToken = process.env.META_VERIFY_TOKEN

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WhatsApp Webhook verified successfully.')
      return new NextResponse(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    console.error('WhatsApp Webhook verification failed. Token mismatch or invalid mode.')
    return new NextResponse('Verification failed', { status: 403 })
  } catch (error: any) {
    console.error('Error in GET verification:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * POST Method: Parses incoming WhatsApp payload, queries doctor schedules,
 * prompts the LLM in Egyptian dialect, and responds back via Meta API.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(payload, null, 2))

    // Parse the payload structures safely
    const entry = payload.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value

    if (!value || !value.messages || value.messages.length === 0) {
      // Just return a 200 OK for other payloads (e.g. read status updates)
      return NextResponse.json({ status: 'ignored', reason: 'No messages in webhook payload' })
    }

    const message = value.messages[0]
    const fromNumber = message.from
    const userMessage = message.text?.body

    if (!userMessage) {
      return NextResponse.json({ status: 'ignored', reason: 'Received non-text message type' })
    }

    // Fetch doctors and active schedules from the database
    const doctors = await prisma.doctor.findMany({
      include: {
        schedules: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
      },
    })

    // Format schedule text for LLM context
    const daysArabic = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    const scheduleContext = doctors
      .map((doc) => {
        const scheduleLines = doc.schedules
          .map((sch) => {
            const dayName = daysArabic[sch.dayOfWeek] || `اليوم ${sch.dayOfWeek}`
            return `- ${dayName}: من الساعة ${sch.startTime} إلى ${sch.endTime} (غرفة: ${sch.roomNumber || 'غير محددة'}، أقصى عدد مرضى: ${sch.maxPatients})`
          })
          .join('\n')

        return `الدكتور/ة: ${doc.name}\nالتخصص: ${doc.specialty}\nمعلومات التواصل: ${doc.contactDetails || 'غير متوفرة'}\nالمواعيد المتاحة:\n${scheduleLines || 'لا توجد مواعيد مسجلة حالياً.'}`
      })
      .join('\n\n')

    // Formulate a strict system prompt targeting Egyptian Dialect (without Markdown formatting)
    const systemPrompt = `أنت موظف استقبال ذكي ولطيف للغاية في عيادة طبية (مساعد واتساب).
لغتك الأساسية هي اللهجة المصرية العامية المحترمة والمهذبة (مثلاً استخدم كلمات مثل: "حضرتك"، "يا فندم"، "أهلاً بك"، "تحت أمرك").
مهمتك هي الإجابة على استفسارات المرضى حول مواعيد الأطباء وتخصصاتهم بدقة شديدة بالاعتماد *فقط* على بيانات العيادة الواردة أدناه.

قواعد هامة جداً:
1. اعتمد *فقط* على البيانات المتاحة. إذا سأل المريض عن طبيب أو تخصص غير موجود، أخبره بلطف شديد أن هذا الطبيب أو التخصص غير متوفر حالياً. لا تخترع أي معلومات.
2. لا تستخدم علامات التنسيق الخاصة بـ Markdown على الإطلاق، وخاصة النجمتين (مثل **الخط العريض**). يجب إزالة أي علامات نجمة من الرد تماماً لكي يظهر النص بسيطاً ونظيفاً على شاشة الهاتف.
3. اجعل الإجابة مختصرة وواضحة جداً (من 3 إلى 4 أسطر كحد أقصى).
4. لا تكتب صيغ برمجية أو وسوم. فقط نص عادي وودود.

بيانات مواعيد العيادة والأطباء المتاحة:
${scheduleContext}`

    let aiReply = ''

    // 1. Try OpenAI if API key exists
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 300,
        })
        aiReply = completion.choices[0]?.message?.content || ''
      } catch (err) {
        console.error('Error invoking OpenAI:', err)
      }
    }

    // 2. Fallback to Gemini if OpenAI failed or key is missing
    if (!aiReply && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
      try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        const ai = new GoogleGenAI({ apiKey })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nسؤال المريض: ${userMessage}` }] },
          ],
          config: {
            temperature: 0.3,
            maxOutputTokens: 300,
          },
        })
        aiReply = response.text || ''
      } catch (err) {
        console.error('Error invoking Gemini:', err)
      }
    }

    // 3. Fallback message if no LLM answered successfully
    if (!aiReply) {
      console.warn('No LLM client responded. Falling back to default message.')
      aiReply = 'أهلاً بحضرتك يا فندم. نعتذر جداً، هناك مشكلة تقنية مؤقتة في نظام العيادة. يمكنك المحاولة مرة أخرى لاحقاً أو الاتصال بنا مباشرة.'
    }

    // Ensure all markdown bold/stars are fully stripped
    aiReply = aiReply.replace(/\*\*/g, '').replace(/\*/g, '').trim()

    // 4. Downstream POST request to Meta Graph API
    const metaAccessToken = process.env.META_ACCESS_TOKEN
    const metaPhoneNumberId = process.env.META_PHONE_NUMBER_ID

    if (metaAccessToken && metaPhoneNumberId) {
      const url = `https://graph.facebook.com/v18.0/${metaPhoneNumberId}/messages`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: fromNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: aiReply,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Meta Graph API response error:', errorData)
        return NextResponse.json(
          {
            status: 'error',
            message: 'Failed to dispatch WhatsApp response to Meta',
            detail: errorData,
          },
          { status: 502 }
        )
      }

      console.log(`Dispatched response to WhatsApp receiver ${fromNumber} successfully.`)
    } else {
      console.log(
        `Meta credentials missing (META_ACCESS_TOKEN / META_PHONE_NUMBER_ID). Skipping live message dispatch.\n` +
          `Recipient: ${fromNumber}\n` +
          `AI Response text:\n${aiReply}`
      )
    }

    return NextResponse.json({
      status: 'success',
      recipient: fromNumber,
      message: aiReply,
    })
  } catch (error: any) {
    console.error('Error handling incoming WhatsApp webhook POST request:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

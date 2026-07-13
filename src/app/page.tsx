import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MessageSquare, Keyboard, ArrowRight, HeartPulse } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex-1 bg-gradient-to-tr from-sky-50/60 via-slate-50 to-white text-text-base font-sans selection:bg-primary-blue/20 flex flex-col min-h-screen relative">
      
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-gradient-to-b from-accent-cerulean/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-gradient-to-b from-primary-blue/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar with Backdrop Blur */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-border-precision">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between" dir="rtl">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-blue/10 rounded-lg text-primary-blue">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-text-base">Clinic WhatsApp Agent MVP</span>
          </div>

          {/* Action Button */}
          <div>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-primary-blue to-accent-cerulean hover:from-primary-blue-hover hover:to-accent-cerulean/90 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_4px_12px_rgba(30,58,138,0.15)] hover:shadow-[0_6px_20px_rgba(30,58,138,0.25)] inline-block hover:-translate-y-0.5"
            >
              لوحة الاستقبال
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 w-full" dir="rtl">
        
        {/* Left Column: Text & Content */}
        <div className="lg:col-span-7 space-y-8 text-right flex flex-col justify-center">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-base leading-[1.15]">
              ربط وتسهيل إدارة عيادتك{' '}
              <span className="bg-gradient-to-r from-primary-blue to-accent-cerulean bg-clip-text text-transparent block sm:inline">
                بالكامل وتلقائياً
              </span>
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl font-bold">
              لوحة تحكم استقبال ذكية وموظف استقبال آلي بالذكاء الاصطناعي يجيب المرضى على واتساب بلهجة مصرية عامية مهذبة على مدار الساعة لتنظيم المواعيد وتخفيف العبء عن الطاقم الطبي.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start w-full max-w-md pt-2">
            <Link
              href="/dashboard"
              className="group flex h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary-blue to-accent-cerulean hover:from-primary-blue-hover hover:to-accent-cerulean/90 text-white font-extrabold px-10 transition-all shadow-[0_8px_30px_rgba(30,58,138,0.25)] hover:shadow-[0_12px_45px_rgba(30,58,138,0.35)] w-full sm:w-auto text-center hover:-translate-y-0.5"
            >
              <span>الدخول للوحة الاستقبال</span>
              <ArrowRight className="w-4 h-4 mr-1 rotate-180 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Doctor Image with Arched Container & Floating Animation */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          {/* Circular Accent Backgrounds */}
          <div className="absolute w-[380px] h-[380px] rounded-full border border-primary-blue/10 bg-gradient-to-tr from-primary-blue/5 to-transparent -z-10 animate-spin-slow pointer-events-none" />
          <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-primary-blue/10 -z-10 pointer-events-none" />

          {/* Arch Frame with custom float animation and gradient border */}
          <div className="relative w-full max-w-[340px] aspect-[4/5] overflow-hidden rounded-t-full bg-gradient-to-tr from-primary-blue/30 via-accent-cerulean/20 to-transparent p-[4px] shadow-[0_20px_50px_rgba(30,58,138,0.15)] animate-float">
            <div className="relative w-full h-full overflow-hidden rounded-t-full border-[5px] border-white bg-gradient-to-b from-sky-200 to-sky-50">
              <Image
                src="/hero_doctor_image.png"
                alt="Professional Friendly Doctor"
                fill
                sizes="(max-width: 768px) 100vw, 340px"
                className="object-cover object-top scale-105 hover:scale-100 transition-all duration-700"
                priority
              />
            </div>
          </div>
        </div>

      </main>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20 w-full" dir="rtl">
        <div className="text-center space-y-3 mb-16">
          <div className="text-xs font-bold text-accent-cerulean tracking-widest uppercase">خصائص المنظومة</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-base">نقدم حلولاً متكاملة لمستقبل عيادتك</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-sm border border-border-precision/60 p-8 rounded-lg text-right space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:border-primary-blue/30 hover:shadow-[0_12px_35px_rgba(30,58,138,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary-blue/10 border border-primary-blue/20 text-primary-blue flex items-center justify-center">
              <Keyboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-base">لوحة تحكم الاستقبال</h3>
            <p className="text-sm text-text-muted leading-relaxed font-bold">
              واجهة تفاعلية سريعة تتيح لموظف الاستقبال الفلترة الفورية للأطباء، ومراجعة مواعيد العيادات، واستدعاء لوحة البحث السريع Spotlight بضغطة مفاتيح Ctrl+K المريحة.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-sm border border-border-precision/60 p-8 rounded-lg text-right space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:border-primary-blue/30 hover:shadow-[0_12px_35px_rgba(30,58,138,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-accent-cerulean/10 border border-accent-cerulean/20 text-accent-cerulean flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-base flex items-center gap-2 justify-start">
              <span>مجيب واتساب بالـ</span>
              <span dir="ltr">AI</span>
            </h3>
            <p className="text-sm text-text-muted leading-relaxed font-bold">
              خطاف ويب يستقبل رسائل المرضى على واتساب، ويستعلم عن جدول العيادات من قاعدة البيانات، ويرد تلقائياً بلهجة مصرية عامية مهذبة كأنه موظف استقبال بشري.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-sm border border-border-precision/60 p-8 rounded-lg text-right space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:border-primary-blue/30 hover:shadow-[0_12px_35px_rgba(30,58,138,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary-blue/10 border border-primary-blue/20 text-primary-blue flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-base">دفتر الحضور والحصاد</h3>
            <p className="text-sm text-text-muted leading-relaxed font-bold">
              تسجيل حضور وانصراف الأطباء يومياً بنقرة واحدة، مع احتساب إجمالي أيام الحضور الفعلي شهرياً لكل طبيب في النظام تلقائياً لتسهيل إدارة المستحقات.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border-precision text-center text-xs text-text-muted bg-white/50 w-full mt-auto">
        <p dir="rtl" className="font-bold">تم التطوير بجودة إنتاجية عالية • Clinic WhatsApp Agent MVP • 2026</p>
      </footer>
    </div>
  )
}

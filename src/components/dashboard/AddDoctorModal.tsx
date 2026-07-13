'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface AddDoctorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, specialty: string, contactDetails: string) => Promise<void>
}

export default function AddDoctorModal({ isOpen, onClose, onSubmit }: AddDoctorModalProps) {
  const [docName, setDocName] = useState('')
  const [docSpecialty, setDocSpecialty] = useState('')
  const [docContact, setDocContact] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docName || !docSpecialty) {
      alert('الرجاء إدخال اسم الطبيب والتخصص.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(docName, docSpecialty, docContact)
      setDocName('')
      setDocSpecialty('')
      setDocContact('')
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="relative bg-white border border-border-precision rounded-lg max-w-md w-full overflow-hidden shadow-xl p-6 text-right animate-in fade-in zoom-in-95 duration-150" dir="rtl">
        <div className="flex items-center justify-between border-b border-border-precision pb-3 mb-4">
          <h3 className="font-extrabold text-base text-text-base">إضافة ملف طبيب جديد</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">اسم الدكتور</label>
            <input
              type="text"
              required
              placeholder="مثال: دكتور خالد عبد الرحمن"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all placeholder-text-muted/65"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">التخصص الطبي</label>
            <input
              type="text"
              required
              placeholder="مثال: عظام، باطنة، أطفال، جلدية"
              value={docSpecialty}
              onChange={(e) => setDocSpecialty(e.target.value)}
              className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all placeholder-text-muted/65"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">تفاصيل التواصل (رقم الهاتف)</label>
            <input
              type="text"
              placeholder="مثال: 01023456789"
              value={docContact}
              onChange={(e) => setDocContact(e.target.value)}
              className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-left font-mono placeholder-text-muted/65"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-border-precision hover:bg-slate-55 rounded-lg text-sm font-bold text-text-muted transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg text-sm font-bold disabled:opacity-55 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(30,58,138,0.15)]"
            >
              {submitting ? 'جاري الحفظ...' : 'حفظ الملف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

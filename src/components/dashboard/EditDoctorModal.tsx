'use client'

import React, { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'

interface Doctor {
  id: string
  name: string
  specialty: string
  contactDetails: string | null
}

interface EditDoctorModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor | null
  onSubmit: (id: string, name: string, specialty: string, contactDetails: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function EditDoctorModal({
  isOpen,
  onClose,
  doctor,
  onSubmit,
  onDelete,
}: EditDoctorModalProps) {
  const [docName, setDocName] = useState('')
  const [docSpecialty, setDocSpecialty] = useState('')
  const [docContact, setDocContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (doctor) {
      setDocName(doctor.name)
      setDocSpecialty(doctor.specialty)
      setDocContact(doctor.contactDetails || '')
      setConfirmDelete(false)
    }
  }, [doctor, isOpen])

  if (!isOpen || !doctor) return null

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docName || !docSpecialty) {
      alert('الرجاء إدخال اسم الطبيب والتخصص.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(doctor.id, docName, docSpecialty, docContact)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setSubmitting(true)
    try {
      await onDelete(doctor.id)
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
          <h3 className="font-extrabold text-base text-text-base">تعديل ملف الطبيب</h3>
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

          <div className="flex items-center justify-between border-t border-border-precision pt-4 mt-6">
            <div>
              {confirmDelete ? (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تأكيد الحذف النهائي؟</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3.5 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الطبيب</span>
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-border-precision hover:bg-slate-50 rounded-lg text-sm font-bold text-text-muted transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg text-sm font-bold disabled:opacity-55 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(30,58,138,0.15)]"
              >
                {submitting ? 'جاري الحفظ...' : 'حفظ التعديل'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

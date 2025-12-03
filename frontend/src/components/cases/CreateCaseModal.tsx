import { useEffect, useState, FormEvent, DragEvent } from 'react'
import { CheckCircle, Clock, UploadCloud, X } from 'lucide-react'

export interface CreateCaseFormData {
  title: string
  client: string
  type: string
  notes: string
}

interface CreateCaseModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: CreateCaseFormData) => void
}

const CreateCaseModal = ({ isOpen, onClose, onCreate }: CreateCaseModalProps) => {
  const [, setStep] = useState(1)
  const [formData, setFormData] = useState<CreateCaseFormData>({
    title: '',
    client: '',
    type: 'Civil Litigation',
    notes: '',
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData({ title: '', client: '', type: 'Civil Litigation', notes: '' })
      setIsAnalyzing(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnalyzing(true)
    setTimeout(() => {
      setFormData({
        title: 'Verma v. City Infrastructure Ltd.',
        client: 'Vikram Verma',
        type: 'Consumer Dispute',
        notes:
          'Extracted from "Notice_Draft_v1.pdf". Case involves delay in possession of flat.',
      })
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onCreate(formData)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Legal Matter</h2>
            <p className="text-sm text-slate-500">Create a new case file or import from a document.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 mb-8 text-center transition-all ${
              isAnalyzing
                ? 'border-orange-400 bg-orange-50'
                : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50/30'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex flex-col items-center py-2">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-3" />
                <p className="font-medium text-orange-800">Analyzing Document...</p>
                <p className="text-xs text-orange-600">
                  Extracting Client, Jurisdiction &amp; Cause of Action
                </p>
              </div>
            ) : (
              <div className="group cursor-pointer">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                  <UploadCloud size={24} />
                </div>
                <h3 className="font-medium text-slate-900">Smart Intake</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Drag &amp; drop a Legal Notice, Petition, or Contract here.
                </p>
                <p className="text-xs text-slate-400 mt-2">AI will auto-fill the case details.</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs font-bold text-slate-400 uppercase">Or Enter Manually</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <form
            id="create-case-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Client Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-shadow"
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Matter Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white"
                >
                  <option>Civil Litigation</option>
                  <option>Criminal Defense</option>
                  <option>Corporate Advisory</option>
                  <option>Family / Matrimonial</option>
                  <option>Employment Dispute</option>
                  <option>Consumer Dispute</option>
                  <option>IPR / Trademark</option>
                  <option>Insolvency (IBC)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Case Title / Cause Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                placeholder="e.g. Kumar v. State of Maharashtra"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Initial Notes / Description
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none"
                placeholder="Brief facts, key dates, or opposing counsel details..."
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-case-form"
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} /> Create Matter
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCaseModal

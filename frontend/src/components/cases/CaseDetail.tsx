import { useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  File,
  FileText,
  Filter,
  Mail,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  Scale,
  Settings,
  Sparkles,
  Users,
  X,
  ArrowLeft,
} from 'lucide-react'
import type { CaseArtifact, CaseNote, LegalCase } from '../../types'

interface CaseDetailProps {
  caseData: LegalCase
  onBack: () => void
  onOpenEditor: (c: LegalCase) => void
}

const CaseDetail = ({ caseData, onBack, onOpenEditor }: CaseDetailProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'notes'>('overview')
  const [selectedArtifact, setSelectedArtifact] = useState<CaseArtifact | null>(null)
  const [noteInput, setNoteInput] = useState('')

  const stages = caseData.stages || ['Intake', 'Drafting', 'Discovery', 'Hearing', 'Closing']
  const statusToStageIndex: Record<string, number> = {
    Intake: 0,
    Drafting: 1,
    Discovery: 2,
    Review: 2,
    Hearing: 3,
    Trial: 3,
    Closing: 4,
  }
  const currentStage =
    typeof caseData.currentStage === 'number'
      ? caseData.currentStage
      : statusToStageIndex[caseData.status] ?? 0

  const client =
    typeof caseData.client === 'string'
      ? { name: caseData.client, phone: '—', email: '—' }
      : caseData.client || { name: '—', phone: '—', email: '—' }

  const opposing =
    caseData.opposing || {
      name: 'Opposing Party',
      counsel: '—',
      phone: '—',
    }

  const judge =
    caseData.judge || {
      name: 'Presiding Judge',
      court: 'Court to be assigned',
    }

  const deadlines = (caseData.deadlines || []).map((d, idx) => ({
    id: (d as any).id ?? idx + 1,
    task: d.task,
    date: d.date,
    urgent: (d as any).urgent ?? false,
  }))

  const notesArray: CaseNote[] = Array.isArray(caseData.notes)
    ? (caseData.notes as CaseNote[])
    : [
        {
          id: 1,
          author: 'Case Notes',
          date: caseData.lastUpdated || 'Recent',
          text: (caseData.notes as string) || 'No notes added yet.',
          billable: false,
        },
      ]

  const ArtifactBrowser = () => (
    <div className="flex h-[600px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* File List */}
      <div
        className={`flex-1 border-r border-slate-200 overflow-y-auto ${
          selectedArtifact ? 'hidden md:block' : ''
        }`}
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-sm">
            Case Files ({caseData.artifacts.length})
          </span>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500">
              <Plus size={16} />
            </button>
            <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500">
              <Filter size={16} />
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {caseData.artifacts.map((art) => (
            <div
              key={art.id ?? art.name}
              onClick={() => setSelectedArtifact(art)}
              className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                selectedArtifact?.id === art.id ? 'bg-orange-50' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-2 rounded shrink-0 ${
                  art.type === 'contract'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{art.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {art.date} • {(art as any).size || 'Document'}
                </p>
                {art.tags && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {art.tags.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Pane */}
      <div
        className={`w-[400px] shrink-0 bg-slate-50 flex flex-col ${
          !selectedArtifact ? 'hidden' : 'block'
        }`}
      >
        {selectedArtifact ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 truncate pr-4">
                {selectedArtifact.name}
              </h3>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-orange-600">
                  <Eye size={18} />
                </button>
                <button
                  className="text-slate-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedArtifact(null)
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles size={12} /> AI Analysis
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {(selectedArtifact as any).summary || 'No analysis available yet.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">
                    Uploaded Date
                  </span>
                  <span className="text-sm text-slate-900">{selectedArtifact.date}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">
                    Classification
                  </span>
                  <span className="text-sm capitalize text-slate-900 bg-slate-200 px-2 py-1 rounded inline-block">
                    {selectedArtifact.type}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenEditor(caseData)}
                className="w-full mt-8 py-2 bg-white border border-orange-200 text-orange-700 font-medium rounded-lg hover:bg-orange-50 shadow-sm text-sm"
              >
                Cite in Editor
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <File size={48} className="mb-2 opacity-20" />
            <p className="text-sm">Select a file to preview</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header with stage pipeline */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Matters
          </button>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Billable
            </span>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{caseData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Users size={14} /> {client.name}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="font-mono text-xs">{caseData.id}</span>
            </div>
          </div>
          <button
            onClick={() => onOpenEditor(caseData)}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <FileText size={18} /> Draft Document
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="mb-2">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-100 -z-10" />
            {stages.map((stage, idx) => {
              const isActive = idx === currentStage
              const isPast = idx < currentStage
              return (
                <div
                  key={stage}
                  className="flex flex-col items-center gap-2 bg-white px-2"
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      isActive
                        ? 'bg-orange-600 border-orange-600 ring-4 ring-orange-100'
                        : isPast
                          ? 'bg-slate-800 border-slate-800'
                          : 'bg-white border-slate-300'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isActive
                        ? 'text-orange-600'
                        : isPast
                          ? 'text-slate-700'
                          : 'text-slate-400'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-8 -mb-6">
          {['overview', 'documents', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-bold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Left: key people & notes snapshot */}
            <div className="col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Users size={18} className="text-slate-400" /> Key Parties
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Client</p>
                    <p className="font-medium text-slate-900">{client.name}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Phone size={12} /> {client.phone}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Mail size={12} /> {client.email}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Opposing</p>
                    <p className="font-medium text-slate-900">{opposing.name}</p>
                    <p className="text-xs text-slate-600 mt-1">{opposing.counsel}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Phone size={12} /> {opposing.phone}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Presiding</p>
                    <p className="font-medium text-slate-900">{judge.name}</p>
                    <p className="text-xs text-slate-600 mt-1">{judge.court}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Case Notes Snapshot</h3>
                <div className="space-y-4">
                  {notesArray.slice(0, 2).map((note) => (
                    <div key={note.id} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
                        <div className="w-0.5 h-full bg-slate-100 my-1" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-500">{note.date}</span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">
                            {note.author}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {note.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('notes')}
                    className="text-sm text-orange-600 font-medium hover:underline w-full text-center"
                  >
                    View Case Diary
                  </button>
                </div>
              </div>
            </div>

            {/* Right: deadlines & actions */}
            <div className="col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-slate-400" /> Next Deadlines
                </h3>
                {deadlines.length > 0 ? (
                  <div className="space-y-3">
                    {deadlines.map((d) => (
                      <div
                        key={d.id}
                        className={`p-3 rounded-lg border flex gap-3 items-start ${
                          d.urgent ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div
                          className={`mt-1 ${d.urgent ? 'text-rose-500' : 'text-slate-400'}`}
                        >
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              d.urgent ? 'text-rose-900' : 'text-slate-800'
                            }`}
                          >
                            {d.task}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              d.urgent ? 'text-rose-600' : 'text-slate-500'
                            }`}
                          >
                            Due: {d.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No immediate deadlines.</p>
                )}
              </div>

              <div className="bg-slate-800 p-6 rounded-xl text-white shadow-lg">
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-slate-400">
                  Firm Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded flex items-center gap-2 text-sm transition-colors">
                    <Plus size={16} /> Add Task
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded flex items-center gap-2 text-sm transition-colors">
                    <DollarSign size={16} /> Log Expense
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded flex items-center gap-2 text-sm transition-colors">
                    <Calendar size={16} /> Schedule Hearing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && <ArtifactBrowser />}

        {activeTab === 'notes' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a case note, phone log, or strategy idea..."
                className="w-full resize-none outline-none text-slate-800 placeholder:text-slate-400 min-h-[100px]"
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                    <Paperclip size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                    <Clock size={18} />
                  </button>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 rounded-full cursor-pointer hover:bg-slate-200">
                    <input type="checkbox" className="rounded text-orange-600" />
                    Billable
                  </label>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                  Save Note
                </button>
              </div>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 py-2">
              {notesArray.map((note) => (
                <div key={note.id} className="relative group">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-orange-500 group-hover:text-orange-600 transition-colors">
                    <MessageSquare size={12} />
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-bold text-slate-800 text-sm mr-2">
                          {note.author}
                        </span>
                        <span className="text-xs text-slate-500">{note.date}</span>
                      </div>
                      {note.billable && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded uppercase tracking-wide">
                          Billable
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm">{note.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaseDetail

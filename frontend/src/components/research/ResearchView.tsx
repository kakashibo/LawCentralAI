import { useState } from 'react'
import { Bookmark, CheckCircle, Filter, Scale, Search, Share2, Sparkles, X } from 'lucide-react'
import { MOCK_INDIAN_CASES } from '../../mockData'
import type { LegalCase, ResearchCase } from '../../types'

interface ResearchViewProps {
  onAddToCase: (citation: ResearchCase, targetCaseId: string) => void
  cases: LegalCase[]
}

const ResearchView = ({ onAddToCase, cases }: ResearchViewProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCase, setSelectedCase] = useState<ResearchCase | null>(null)
  const [activeFilters, setActiveFilters] = useState({
    sc: true,
    hc: true,
    tribunal: true,
  })
  const [showSaveModal, setShowSaveModal] = useState(false)

  const filteredResults = MOCK_INDIAN_CASES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.snippet.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (c.court.includes('Supreme Court') && !activeFilters.sc) return false
    if (c.court.includes('High Court') && !activeFilters.hc) return false
    if (c.court.includes('NCLT') && !activeFilters.tribunal) return false

    return true
  })

  const handleSaveToCase = (targetCaseId: string) => {
    if (!selectedCase) return
    onAddToCase(selectedCase, targetCaseId)
    setShowSaveModal(false)
    setSelectedCase(null)
  }

  return (
    <div className="flex h-full bg-slate-100 overflow-hidden">
      {/* A. Left Filter Panel */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Filter size={18} /> Filters
          </h2>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Jurisdiction */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Courts
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.sc}
                  onChange={() =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      sc: !prev.sc,
                    }))
                  }
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                Supreme Court
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.hc}
                  onChange={() =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      hc: !prev.hc,
                    }))
                  }
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                High Courts
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.tribunal}
                  onChange={() =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      tribunal: !prev.tribunal,
                    }))
                  }
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                Tribunals (NCLT/ITAT)
              </label>
            </div>
          </div>

          {/* Acts */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Acts &amp; Statutes
            </h3>
            <div className="space-y-2">
              {[
                'Constitution of India',
                'IPC / BNS 2023',
                'Companies Act 2013',
                'IBC 2016',
              ].map((act) => (
                <label
                  key={act}
                  className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded"
                >
                  <input
                    type="radio"
                    name="act_filter"
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  {act}
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Time Period
            </h3>
            <input type="range" className="w-full accent-orange-600" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1950</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* B. Center Results Feed */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-slate-50">
        {/* Search Header */}
        <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by keyword, Act, or Citation (e.g., 'Right to Privacy')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-xs font-medium text-slate-500 pt-1">Suggested:</span>
            <button
              onClick={() => setSearchTerm('Privacy')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => setSearchTerm('Bail')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
            >
              Bail Conditions
            </button>
            <button
              onClick={() => setSearchTerm('Insolvency')}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
            >
              Insolvency
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              onClick={() => setSelectedCase(result)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedCase?.id === result.id
                  ? 'bg-orange-50 border-orange-300 shadow-md'
                  : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded border border-slate-200">
                  {result.citation}
                </span>
                <div className="flex items-center gap-2">
                  {result.status === 'good_law' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> Good Law
                    </span>
                  )}
                  {result.status === 'distinguished' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Scale size={10} /> Distinguished
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                {result.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {result.court} {' '}
                {result.date} {' '}
                {result.bench}
              </p>

              <p className="text-sm text-slate-700 mb-3 line-clamp-2 leading-relaxed">
                <span className="font-semibold text-slate-900">Held: </span>
                {result.snippet}
              </p>

              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filteredResults.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p>No judgments found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* C. Right Reading Pane (Slide over) */}
      {selectedCase && (
        <div className="w-[500px] bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-20 shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex justify-between items-start bg-slate-50">
            <div>
              <h2 className="font-bold text-slate-800 leading-tight pr-4">
                {selectedCase.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{selectedCase.citation}</p>
            </div>
            <button
              onClick={() => setSelectedCase(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toolbar */}
          <div className="px-4 py-2 border-b border-slate-100 flex gap-2">
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md text-sm font-medium flex justify-center items-center gap-2 transition-colors"
            >
              <CheckCircle size={16} /> Add to Case
            </button>
            <button className="p-2 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
              <Share2 size={18} />
            </button>
            <button className="p-2 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
              <Bookmark size={18} />
            </button>
          </div>

          {/* Reading Area */}
          <div className="flex-1 overflow-y-auto p-6 font-serif leading-loose text-slate-800 text-sm">
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h4 className="font-sans font-bold text-xs text-yellow-800 uppercase mb-2 flex items-center gap-2">
                <Sparkles size={12} /> AI Summary
              </h4>
              <p className="text-yellow-900 leading-normal">{selectedCase.summary}</p>
            </div>

            <h3 className="font-sans font-bold text-slate-900 uppercase tracking-wider text-xs mb-4 border-b pb-2">
              Full Judgement Text
            </h3>
            <p className="whitespace-pre-line">{selectedCase.judgement_text}</p>
          </div>

          {/* AI Chat Input for this doc */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI about this judgement..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-orange-600 rounded-full text-white">
                <Sparkles size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && selectedCase && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Add Citation to Matter</h3>
            <p className="text-sm text-slate-500 mb-4">
              Select which active matter you want to attach <b>{selectedCase.citation}</b> to:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSaveToCase(c.id)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                >
                  <div className="font-medium text-slate-800 group-hover:text-orange-700">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {typeof c.client === 'string' ? c.client : c.client.name}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSaveModal(false)}
              className="w-full py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearchView

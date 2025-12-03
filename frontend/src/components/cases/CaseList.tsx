import { useState } from 'react'
import { ChevronRight, Plus, Search } from 'lucide-react'
import type { LegalCase } from '../../types'

interface CaseListProps {
  cases: LegalCase[]
  onSelectCase: (c: LegalCase) => void
  onOpenCreate: () => void
}

const CaseList = ({ cases, onSelectCase, onOpenCreate }: CaseListProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const normalizedCases = cases.map((c) => ({
    ...c,
    clientName: typeof c.client === 'string' ? c.client : c.client.name,
  }))

  const filteredCases = normalizedCases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-8 py-6 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Matter Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Active litigations, filings, and advisory.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search matters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none w-64"
            />
          </div>
          <button
            onClick={onOpenCreate}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-700"
          >
            <Plus size={18} /> New Matter
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Matter ID / Title
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="hover:bg-orange-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">{c.id}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.clientName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight
                      size={20}
                      className="text-slate-300 group-hover:text-orange-600 inline"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CaseList

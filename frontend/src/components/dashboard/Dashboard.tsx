import { Briefcase, Clock, Gavel, BookOpen, ChevronRight, Search, Plus } from 'lucide-react'
import { MOCK_CASES } from '../../mockData'
import type { LegalCase } from '../../types'

interface DashboardProps {
  onNavigate: (view: string, data?: LegalCase | null) => void
  onOpenCreate: () => void
}

const Dashboard = ({ onNavigate, onOpenCreate }: DashboardProps) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suprabhat, Advocate Rao</h1>
          <p className="text-slate-500">Here's your firm's overview for today.</p>
        </div>
        <div className="lg:hidden">
          <button
            onClick={onOpenCreate}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={18} /> New
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Active Matters',
            value: '12',
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Court Listings',
            value: '3',
            icon: Gavel,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Billable Hours',
            value: '34.5',
            icon: Clock,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Research Clips',
            value: '8',
            icon: BookOpen,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Recent Active Matters</h2>
            <button
              onClick={() => onNavigate('cases')}
              className="text-orange-600 text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_CASES.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                onClick={() => onNavigate('cases', c)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {c.id.split('-')[2]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{c.title}</h3>
                    <p className="text-sm text-slate-500">
                      {c.type} {' '}
                      {typeof c.client === 'string' ? c.client : c.client.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.status === 'Discovery'
                        ? 'bg-purple-100 text-purple-700'
                        : c.status === 'Drafting'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c.status}
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-orange-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-lg">Cause List & Tasks</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-3 items-start">
              <div className="mt-1 text-rose-600">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-900">NCLT Filing Due</p>
                <p className="text-xs text-rose-700 mt-1">
                  GreenEnergy Merger filing by 5:00 PM.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('research')}
              className="w-full mt-2 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm font-medium hover:border-orange-500 hover:text-orange-600 transition-colors flex justify-center items-center gap-2"
            >
              <Search size={16} /> Research Case Law
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

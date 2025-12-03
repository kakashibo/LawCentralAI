import { Briefcase, FileText, LayoutDashboard, BookOpen, Plus, Scale } from 'lucide-react'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  onOpenCreate: () => void
}

const Sidebar = ({ activeView, setActiveView, onOpenCreate }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'cases', icon: Briefcase, label: 'Case Manager' },
    { id: 'editor', icon: FileText, label: 'Legal Editor' },
    { id: 'research', icon: BookOpen, label: 'Research Engine' },
  ] as const

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0">
      <div className="p-6 flex items-center gap-3 text-white mb-6">
        <div className="bg-orange-600 p-2 rounded-lg">
          <Scale size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight leading-none">LawCentral</span>
          <span className="text-[10px] text-orange-400 font-medium tracking-wider uppercase">
            India
          </span>
        </div>
      </div>

      <div className="px-4 mb-6">
        <button
          onClick={onOpenCreate}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
        >
          <Plus size={18} /> New Matter
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === item.id
                ? 'bg-slate-800 text-white shadow-inner border-l-4 border-orange-500'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-xs">
            AR
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">Adv. A. Rao</span>
            <span className="text-xs text-slate-500">Senior Partner</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

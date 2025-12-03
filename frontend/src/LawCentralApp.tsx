import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import CaseList from './components/cases/CaseList'
import CaseDetail from './components/cases/CaseDetail'
import Editor from './components/editor/Editor'
import ResearchView from './components/research/ResearchView'
import CreateCaseModal, { type CreateCaseFormData } from './components/cases/CreateCaseModal'
import { MOCK_CASES } from './mockData'
import type { LegalCase, ResearchCase } from './types'

type View = 'dashboard' | 'cases' | 'case-detail' | 'editor' | 'research'

const LawCentralApp = () => {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<View>('dashboard')
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null)
  const [editorContext, setEditorContext] = useState<LegalCase | null>(null)
  const [cases, setCases] = useState<LegalCase[]>(MOCK_CASES)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateCase = (newCaseData: CreateCaseFormData) => {
    const newCase: LegalCase = {
      id: `C-2024-${Math.floor(Math.random() * 900) + 100}`,
      ...newCaseData,
      status: 'Intake',
      lastUpdated: 'Just now',
      deadlines: [],
      artifacts: [],
    }
    setCases([newCase, ...cases])
    setIsCreateModalOpen(false)

    setSelectedCase(newCase)
    setActiveView('case-detail')
    navigate('/case-detail')
  }

  const handleAddCitationToCase = (citationData: ResearchCase, targetCaseId: string) => {
    const updatedCases = cases.map((c) => {
      if (c.id === targetCaseId) {
        return {
          ...c,
          artifacts: [
            ...c.artifacts,
            {
              id: Date.now(),
              name: citationData.title,
              type: 'citation',
              date: 'Today',
            },
          ],
        }
      }
      return c
    })
    setCases(updatedCases)
  }

  const handleNavigate = (view: View | string, data: LegalCase | null = null) => {
    if (view === 'dashboard') {
      setActiveView('dashboard')
      navigate('/dashboard')
    } else if (view === 'cases' && data) {
      const found = cases.find((c) => c.id === data.id) || data
      setSelectedCase(found)
      setActiveView('case-detail')
      navigate('/case-detail')
    } else if (view === 'cases') {
      setActiveView('cases')
      navigate('/cases')
    } else if (view === 'editor') {
      setEditorContext(null)
      setActiveView('editor')
      navigate('/editor')
    } else if (view === 'research') {
      setActiveView('research')
      navigate('/research')
    } else if (view === 'case-detail') {
      setActiveView('case-detail')
      navigate('/case-detail')
    } else {
      setActiveView(view as View)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )
      case 'cases':
        return (
          <CaseList
            cases={cases}
            onSelectCase={(c) => handleNavigate('cases', c)}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        )
      case 'case-detail':
        return (
          selectedCase && (
            <CaseDetail
              caseData={selectedCase}
              onBack={() => {
                setSelectedCase(null)
                setActiveView('cases')
              }}
              onOpenEditor={(c) => {
                setEditorContext(c)
                setActiveView('editor')
              }}
            />
          )
        )
      case 'editor':
        return (
          <Editor
            contextCase={editorContext}
            onClose={() => setActiveView(editorContext ? 'case-detail' : 'dashboard')}
          />
        )
      case 'research':
        return <ResearchView cases={cases} onAddToCase={handleAddCitationToCase} />
      default:
        return <Dashboard onNavigate={handleNavigate} onOpenCreate={() => setIsCreateModalOpen(true)} />
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        activeView={activeView === 'case-detail' ? 'cases' : activeView}
        setActiveView={(view) => handleNavigate(view)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
      />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderContent()}
        <CreateCaseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateCase}
        />
      </main>
    </div>
  )
}

export default LawCentralApp

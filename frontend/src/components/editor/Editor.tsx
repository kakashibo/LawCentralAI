import { useEffect, useRef, useState } from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  BookOpen,
  Bot,
  ChevronRight,
  FileText,
  FolderOpen,
  Indent,
  Italic,
  List,
  Outdent,
  Printer,
  Save,
  Scale,
  Send,
  ShieldAlert,
  Sparkles,
  Underline,
  UploadCloud,
  Users,
  X,
} from 'lucide-react'
import type { LegalCase } from '../../types'

interface EditorProps {
  initialContent?: string
  contextCase?: LegalCase | null
  onClose?: () => void
}

type EditorAction =
  | { type: 'insert_text'; label: string; content: string }
  | { type: 'highlight_risk'; label: string }

interface EditorMessage {
  role: 'system' | 'user'
  text: string
  action?: EditorAction
}

const Editor = ({ initialContent, contextCase, onClose }: EditorProps) => {
  const [messages, setMessages] = useState<EditorMessage[]>([
    {
      role: 'system',
      text: 'Hello, Advocate. I am your Legal Co-Pilot. I can help you draft clauses, review risks, or format citations based on this case context.',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filesPanelOpen, setFilesPanelOpen] = useState<boolean>(
    Boolean(contextCase?.artifacts && contextCase.artifacts.length > 0),
  )
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    if (initialContent) {
      editorRef.current.innerHTML = initialContent.replace(/\n/g, '<br/>')
      return
    }

    if (contextCase) {
      const clientNameRaw =
        typeof contextCase.client === 'string'
          ? contextCase.client
          : contextCase.client?.name || 'Client'
      const opposingNameRaw =
        typeof contextCase.opposing === 'string'
          ? contextCase.opposing
          : contextCase.opposing?.name || 'Respondent'

      const clientName = clientNameRaw.toUpperCase()
      const opposingName = opposingNameRaw.toUpperCase()
      const caseType = (contextCase.type || 'Petition').toUpperCase()

      const header = `
        <div style="text-align: center; font-weight: bold; margin-bottom: 20px;">
          IN THE HIGH COURT OF DELHI AT NEW DELHI<br/><br/>
          ${caseType} NO. ______ OF 2024
        </div>
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between;">
            <span><b>IN THE MATTER OF:</b></span>
          </div>
          <div style="margin-top: 10px;">
            <b>${clientName}</b> ... PETITIONER
          </div>
          <div style="margin: 10px 0; text-align: center;">VERSUS</div>
          <div>
            <b>${opposingName}</b> ... RESPONDENT
          </div>
        </div>
        <br/>
        <div style="text-align: justify;">
          <b>MOST RESPECTFULLY SHOWETH:</b>
        </div>
      `
      editorRef.current.innerHTML = header
    }
  }, [contextCase, initialContent])

  const handleFormat = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMsgs: EditorMessage[] = [...messages, { role: 'user', text: chatInput }]
    setMessages(newMsgs)
    setChatInput('')
    setIsGenerating(true)

    setTimeout(() => {
      let aiResponseText = 'I can certainly help with that.'
      let suggestedAction: EditorAction | undefined

      const lower = chatInput.toLowerCase()
      if (lower.includes('clause') || lower.includes('draft')) {
        aiResponseText =
          'Here is a standard Severability Clause drafted for this jurisdiction. You can insert it directly.'
        suggestedAction = {
          type: 'insert_text',
          label: 'Insert Clause',
          content:
            '<br/><br/><b>14. SEVERABILITY</b><br/>If any provision of this Agreement is held to be illegal, invalid or unenforceable, such provision shall be fully severable; this Agreement shall be construed and enforced as if such illegal, invalid or unenforceable provision had never comprised a part of this Agreement.',
        }
      } else if (lower.includes('risk') || lower.includes('review')) {
        aiResponseText =
          "I've reviewed the document. I found potential risks regarding Indemnification caps. I have highlighted them for your review."
        suggestedAction = {
          type: 'highlight_risk',
          label: 'Highlight Risks',
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          text: aiResponseText,
          action: suggestedAction,
        },
      ])
      setIsGenerating(false)
    }, 1500)
  }

  const executeAIAction = (action: EditorAction) => {
    if (!editorRef.current) return

    if (action.type === 'insert_text') {
      editorRef.current.focus()
      document.execCommand('insertHTML', false, action.content)
    } else if (action.type === 'highlight_risk') {
      const content = editorRef.current.innerHTML
      editorRef.current.innerHTML = content.replace(
        /indemnification/gi,
        '<span style="background-color: #fecaca; border-bottom: 2px solid #ef4444;">indemnification<\/span>',
      )
    }
  }

  return (
    <div className="flex h-full bg-slate-100 relative overflow-hidden">
      {/* Left sidebar: case artifacts */}
      {filesPanelOpen && (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="h-14 border-b border-slate-100 flex items-center px-4 bg-slate-50 font-medium text-slate-700">
            <FolderOpen size={16} className="mr-2 text-slate-500" />
            Files &amp; Artifacts
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {contextCase?.artifacts && contextCase.artifacts.length > 0 ? (
              contextCase.artifacts.map((art) => (
                <div
                  key={art.id}
                  className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer group mb-1 border border-transparent hover:border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-blue-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {art.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 pl-6">
                    {art.date} • {art.type}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                <p>No files linked to this matter.</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-100 px-2">
              <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200 flex items-center justify-center gap-2">
                <UploadCloud size={12} /> Upload New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main editor area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <button
              onClick={() => setFilesPanelOpen((open) => !open)}
              className={`p-2 rounded-full border text-slate-500 hover:bg-slate-100 text-xs font-medium flex items-center gap-1 ${
                filesPanelOpen
                  ? 'border-orange-200 bg-orange-50 text-orange-700'
                  : 'border-slate-200'
              }`}
            >
              <FolderOpen size={14} />
            </button>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                {contextCase ? `Draft: ${contextCase.title}` : 'Untitled Document'}
              </h2>
              <p className="text-[10px] text-slate-500">Last saved: Just now</p>
            </div>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wide">
              Draft Mode
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors">
              <Printer size={14} /> Print
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors hover:bg-slate-800">
              <Save size={14} /> Save Version
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`p-2 rounded-lg transition-colors ${
                aiPanelOpen
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Sparkles size={18} />
            </button>
          </div>
        </div>

        {/* Formatting toolbar */}
        <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-1 overflow-x-auto shrink-0">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => handleFormat('bold')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => handleFormat('italic')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => handleFormat('underline')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
              title="Underline"
            >
              <Underline size={16} />
            </button>
          </div>
          <div className="w-px h-6 bg-slate-300 mx-2" />
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => handleFormat('justifyLeft')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => handleFormat('justifyCenter')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => handleFormat('justifyRight')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
            >
              <AlignRight size={16} />
            </button>
          </div>
          <div className="w-px h-6 bg-slate-300 mx-2" />
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => handleFormat('insertOrderedList')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => handleFormat('indent')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
            >
              <Indent size={16} />
            </button>
            <button
              onClick={() => handleFormat('outdent')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
            >
              <Outdent size={16} />
            </button>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-200 rounded text-slate-700 text-xs font-medium">
              <BookOpen size={14} /> Insert Citation
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-200 rounded text-slate-700 text-xs font-medium">
              <Scale size={14} /> Definitions
            </button>
          </div>
        </div>

        {/* Document surface */}
        <div
          className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center cursor-text"
          onClick={() => editorRef.current?.focus()}
        >
          <div
            ref={editorRef}
            contentEditable
            className="w-[800px] min-h-[1000px] bg-white shadow-lg border border-slate-200 p-12 outline-none font-serif text-lg leading-loose text-slate-900 selection:bg-orange-100 selection:text-orange-900"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>

      {/* AI sidebar */}
      {aiPanelOpen && (
        <div className="w-[350px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-10 shrink-0">
          <div className="h-14 border-b border-slate-100 flex justify-between items-center px-4 bg-slate-50">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Sparkles size={16} className="text-orange-500" />
              <span>Legal Co-Pilot</span>
            </div>
            <button onClick={() => setAiPanelOpen(false)}>
              <X size={18} className="text-slate-400 hover:text-slate-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-slate-200'
                      : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {msg.role === 'user' ? <Users size={16} /> : <Bot size={18} />}
                </div>
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-white text-slate-800 border border-slate-200'
                        : 'bg-orange-50 text-slate-800 border border-orange-100'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  {msg.action && (
                    <button
                      onClick={() => executeAIAction(msg.action!)}
                      className="flex items-center gap-2 w-full p-2 bg-white border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-all text-xs font-medium text-orange-700 group"
                    >
                      {msg.action.type === 'insert_text' ? (
                        <ChevronRight size={14} />
                      ) : (
                        <ShieldAlert size={14} />
                      )}
                      {msg.action.label}
                      <ChevronRight
                        size={14}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              <button
                onClick={() => setChatInput('Draft a severability clause')}
                className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 font-medium transition-colors"
              >
                Draft Clause
              </button>
              <button
                onClick={() => setChatInput('Review document for risks')}
                className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 font-medium transition-colors"
              >
                Risk Review
              </button>
              <button
                onClick={() => setChatInput('Format citations')}
                className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 font-medium transition-colors"
              >
                Fix Citations
              </button>
            </div>
            <div className="relative">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask Legal Co-Pilot..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isGenerating}
                className="absolute right-1.5 top-1.5 p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor

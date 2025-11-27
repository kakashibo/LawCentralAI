import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Search,
  Scale,
  Settings,
  Plus,
  MoreVertical,
  Clock,
  ChevronRight,
  Sparkles,
  Save,
  ArrowLeft,
  Paperclip,
  Maximize2,
  Minimize2,
  Calendar,
  Users,
  MessageSquare,
  Highlighter,
  CheckCircle,
  X,
  Filter,
  BookOpen,
  Landmark,
  Gavel,
  Share2,
  Bookmark,
  UploadCloud,
  File,
  AlertTriangle,
  Phone,
  Mail,
  Eye,
  DollarSign,
  FolderOpen,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Indent,
  Outdent,
  Undo,
  Redo,
  Bot,
  Send,
  Download,
  Printer,
  ShieldAlert,
  ArrowRight,
  Shield,
  Zap,
  Menu,
  Play,
  Star,
} from 'lucide-react'

// --- Mock Data: Cases ---

const MOCK_CASES = [
  {
    id: 'C-2024-001',
    title: 'Sharma v. TechSolutions Pvt Ltd',
    type: 'Employment Dispute',
    status: 'Discovery',
    client: 'Rajesh Sharma',
    lastUpdated: '2 hours ago',
    deadlines: [{ task: 'Submit Rejoinder', date: 'Oct 24, 2024' }],
    artifacts: [
      { id: 1, name: 'Employment Contract.pdf', type: 'document', date: '2023-01-12' },
      { id: 2, name: 'Termination Letter.pdf', type: 'document', date: '2023-03-15' },
    ],
    notes:
      'Client alleges wrongful termination under Section 25F of the Industrial Disputes Act.',
  },
  {
    id: 'C-2024-042',
    title: 'In Re: Estate of V. Kapoor',
    type: 'Probate',
    status: 'Drafting',
    client: 'Anjali Kapoor',
    lastUpdated: '1 day ago',
    deadlines: [{ task: 'File Probate Petition', date: 'Oct 30, 2024' }],
    artifacts: [
      { id: 1, name: 'Will_Final_2020.pdf', type: 'document', date: '2020-11-05' },
    ],
    notes: 'Focus on the validity of the codicil dated Jan 2021.',
  },
  {
    id: 'C-2024-088',
    title: 'Merger: GreenEnergy & SolarInfra',
    type: 'Corporate',
    status: 'Review',
    client: 'GreenEnergy Ltd',
    lastUpdated: '3 days ago',
    deadlines: [{ task: 'NCLT Filing', date: 'Nov 12, 2024' }],
    artifacts: [],
    notes: 'Review compliance with Competition Act, 2002.',
  },
]

// --- Mock Data: Indian Research Database ---

const MOCK_INDIAN_CASES = [
  {
    id: 'R-SC-2017-01',
    citation: 'AIR 2017 SC 4161',
    title: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
    court: 'Supreme Court of India',
    date: '24 Aug 2017',
    bench: '9 Judge Constitution Bench',
    tags: ['Constitutional Law', 'Privacy', 'Article 21', 'Aadhar'],
    status: 'good_law',
    snippet:
      'The right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21 and as a part of the freedoms guaranteed by Part III of the Constitution.',
    summary:
      'Landmark judgment declaring the Right to Privacy as a fundamental right under the Indian Constitution. Overruled MP Sharma and Kharak Singh cases.',
    judgement_text:
      'HELD: \n1. Life and personal liberty are inalienable rights. These are rights which are inseparable from a dignified human existence.\n2. Privacy with its attendant values assures dignity to the individual and it is a cardinal value of the Indian Constitution.\n3. The judgment in MP Sharma holding that the Constitution does not specifically protect the right to privacy is overruled...',
  },
  {
    id: 'R-SC-1973-01',
    citation: 'AIR 1973 SC 1461',
    title: 'Kesavananda Bharati v. State of Kerala',
    court: 'Supreme Court of India',
    date: '24 Apr 1973',
    bench: '13 Judge Constitution Bench',
    tags: ['Constitutional Law', 'Basic Structure', 'Amendment Power'],
    status: 'good_law',
    snippet:
      'Parliament cannot alter the basic features of the Constitution. The power to amend does not include the power to abrogate the Constitution.',
    summary:
      'Established the Basic Structure Doctrine. Parliament can amend any part of the Constitution provided it does not alter its basic structure.',
    judgement_text:
      `HELD: \nBy majority, the decision of the Court is as follows:\n1. Golak Nath's case is overruled.\n2. Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution.\n3. The Constitution (Twenty-fourth Amendment) Act, 1971 is valid...`,
  },
  {
    id: 'R-DEL-2023-45',
    citation: '2023 SCC OnLine Del 1234',
    title: 'XYZ v. State (NCT of Delhi)',
    court: 'Delhi High Court',
    date: '15 Mar 2023',
    bench: 'Division Bench',
    tags: ['Criminal Law', 'Bail', 'BNS 2023'],
    status: 'distinguished',
    snippet:
      'Considerations for bail under the new Bharatiya Nagarik Suraksha Sanhita (BNSS) require a stricter interpretation of flight risk.',
    summary:
      'Discussion on the transition from CrPC to BNSS regarding bail provisions for economic offenses.',
    judgement_text:
      'The court observed that while personal liberty is paramount, the legislative intent behind the new Sanhita reflects a need for stricter compliance in cases involving economic fraud...',
  },
  {
    id: 'R-NCLT-2022-89',
    citation: 'CP (IB) No. 99/2022',
    title: 'Creditor Bank v. Infra Buildtech Ltd',
    court: 'NCLT, Mumbai Bench',
    date: '10 Feb 2022',
    bench: 'Single Bench',
    tags: ['IBC', 'Insolvency', 'Corporate'],
    status: 'good_law',
    snippet:
      'Initiation of CIRP under Section 7 of the IBC. Default amount exceeded the threshold limit.',
    summary:
      'Admission of insolvency petition against corporate debtor for default in repayment of term loans.',
    judgement_text:
      'It is established that there is a debt and a default. The application is complete in all respects. We hereby admit the petition under Section 7...',
  },
]

// --- Simple Marketing Landing Page ---

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      {/* --- 1. NAVIGATION BAR --- */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg text-white">
              <Scale size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none text-slate-900">
                LawCentral
              </span>
              <span className="text-[10px] text-orange-600 font-bold tracking-wider uppercase">
                India
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-orange-600 transition-colors">
              Platform
            </a>
            <a href="#research" className="hover:text-orange-600 transition-colors">
              Research Engine
            </a>
            <a href="#security" className="hover:text-orange-600 transition-colors">
              Security
            </a>
            <a href="#pricing" className="hover:text-orange-600 transition-colors">
              Pricing
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-600 font-medium hover:text-slate-900 px-4 py-2">
              Log In
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
              Book a Demo <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
            <a href="#features" className="text-lg font-medium text-slate-700">
              Platform
            </a>
            <a href="#pricing" className="text-lg font-medium text-slate-700">
              Pricing
            </a>
            <a href="#" className="text-lg font-medium text-slate-700">
              Login
            </a>
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/3 translate-y-1/4" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            New: BNS &amp; BNSS 2023 Support
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
            The Operating System for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Modern Indian Law
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage cases, research Supreme Court precedents, and draft petitions with AI
            assistance. All in one secure, compliant platform built for Indian Advocates.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full md:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-900/20 transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial <ChevronRight size={20} />
            </button>
            <button className="w-full md:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Play size={20} className="fill-slate-700" /> Watch Video
            </button>
          </div>

          {/* App Preview Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl bg-slate-900 p-2 shadow-2xl shadow-slate-900/30 ring-1 ring-slate-900/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-700 rounded-b-lg" />
            <div className="rounded-xl bg-slate-50 overflow-hidden border border-slate-800/50 aspect-[16/10] flex relative">
              {/* Sidebar Mock */}
              <div className="w-16 md:w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:flex flex-col gap-4">
                <div className="h-8 w-8 bg-orange-600 rounded mb-4" />
                <div className="h-4 w-3/4 bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-800 rounded" />
              </div>
              {/* Content Mock */}
              <div className="flex-1 bg-slate-50 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="h-8 w-64 bg-slate-200 rounded mb-2" />
                    <div className="h-4 w-48 bg-slate-100 rounded" />
                  </div>
                  <div className="h-10 w-32 bg-orange-600 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4">
                    <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm" />
                    <div className="h-32 bg-white rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 bg-slate-800 rounded-xl shadow-sm" />
                    <div className="h-64 bg-white rounded-xl border border-slate-200 shadow-sm" />
                  </div>
                </div>

                {/* Floating UI Badge */}
                <div className="absolute bottom-10 right-10 bg-white p-4 rounded-lg shadow-xl border border-slate-100 animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">
                        Task Completed
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        NCLT Filing Uploaded
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-slate-500 text-sm font-medium">
            TRUSTED BY 500+ FIRMS ACROSS INDIA
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="font-serif font-bold text-xl">Luthra &amp; Luthra</div>
            <div className="font-serif font-bold text-xl">Khaitan &amp; Co</div>
            <div className="font-serif font-bold text-xl">Shardul Amarchand</div>
            <div className="font-serif font-bold text-xl">Trilegal</div>
          </div>
        </div>
      </header>

      {/* --- 3. PROBLEM / SOLUTION GRID --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Top Advocates Switch to LawCentral
            </h2>
            <p className="text-lg text-slate-600">
              The traditional way of managing files, research, and drafting in silos is costing you
              billable hours. We unify the workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Matter Management</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                A digital file room for every case. Track stages from Intake to Verdict. Manage
                clients, opposing counsel, and court dates in one view.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-blue-500" /> Visual Stage Pipeline
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-blue-500" /> Automated Deadlines
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Indian Research Engine</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Stop searching through 10 different tabs. Access Supreme Court and High Court
                judgments with "Good Law" indicators and smart summaries.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-orange-500" /> Citations linked to Case
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-orange-500" /> BNS/IPC Toggle
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Legal Co-Pilot</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Draft petitions, contracts, and notices in minutes. Our AI understands Indian legal
                formats and suggests clauses based on your active case.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-purple-500" /> Context-Aware Drafting
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-purple-500" /> Risk Analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. FEATURE DEEP DIVE (AI) --- */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide mb-6">
                <Zap size={14} className="fill-orange-700" /> AI-Powered Drafting
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Your Personal Research Assistant, available 24/7.
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Imagine an assistant that knows every detail of your case and every relevant
                Supreme Court judgment. Ask LawCentral to draft a clause, and it cites the
                precedent automatically.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Instant First Drafts</h4>
                    <p className="text-slate-600 text-sm">
                      Generate formatted petitions for High Court or NCLT in seconds.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Document Review</h4>
                    <p className="text-slate-600 text-sm">
                      Upload opposing counsel's contract. AI highlights risky clauses instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Chat Interface Mock */}
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md mx-auto relative z-10">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Legal Co-Pilot</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
                    </p>
                  </div>
                </div>
                <div className="space-y-4 mb-4">
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="bg-slate-100 p-3 rounded-lg rounded-tr-none text-sm text-slate-800">
                      Draft a non-compete clause for the Sharma employment contract.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-orange-50 p-3 rounded-lg rounded-tl-none text-sm text-slate-800 border border-orange-100">
                      <p className="mb-2">
                        Here is a standard clause compliant with Section 27 of the Indian Contract
                        Act:
                      </p>
                      <div className="bg-white p-2 border border-orange-100 rounded text-xs font-serif italic text-slate-600">
                        "The Employee agrees that during the term of employment..."
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-10 w-full bg-slate-50 rounded-lg border border-slate-200" />
                  <div className="absolute right-2 top-2 text-orange-600">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30 -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. SECURITY BANNER --- */}
      <section className="bg-slate-900 py-16 text-white" id="security">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Shield className="text-green-400" /> Bank-Grade Security
            </h2>
            <p className="text-slate-400 max-w-xl">
              Your client data is encrypted with AES-256 and hosted on servers within India,
              ensuring full compliance with local data residency laws.
            </p>
          </div>
          <div className="flex gap-6 opacity-70">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border border-slate-600 rounded flex items-center justify-center">
                <Shield size={24} />
              </div>
              <span className="text-xs font-bold tracking-wider">SOC2</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border border-slate-600 rounded flex items-center justify-center">
                <FileText size={24} />
              </div>
              <span className="text-xs font-bold tracking-wider">ISO 27001</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. CTA / FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to modernize your practice?
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
            Join the fastest growing network of Indian advocates using AI to win more cases.
          </p>
          <div className="flex justify-center gap-4 mb-20">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              Get Started for Free
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Contact Sales
            </button>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Scale size={16} className="text-orange-600" />
              <span className="font-bold text-slate-700">LawCentral India</span>
              <span>© 2024</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-600">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-600">
                Bar Council Compliance
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// --- Components ---

const Sidebar = ({ activeView, setActiveView, onOpenCreate }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'cases', icon: Briefcase, label: 'Case Manager' },
    { id: 'editor', icon: FileText, label: 'Legal Editor' },
    { id: 'research', icon: BookOpen, label: 'Research Engine' },
  ]

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

const Dashboard = ({ onNavigate, onOpenCreate }) => {
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
                      {c.type}   {c.client}
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

// --- Smart Intake Modal (Keep New Feature) ---

const CreateCaseModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
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

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(formData)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Legal Matter</h2>
            <p className="text-sm text-slate-500">
              Create a new case file or import from a document.
            </p>
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
                <p className="text-xs text-slate-400 mt-2">
                  AI will auto-fill the case details.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs font-bold text-slate-400 uppercase">
              Or Enter Manually
            </span>
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
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
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
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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

// --- RESTORED Full Research View ---

const ResearchView = ({ onAddToCase, cases }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)
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

    // Detailed filter logic restored
    if (!matchesSearch) return false
    if (c.court.includes('Supreme Court') && !activeFilters.sc) return false
    if (c.court.includes('High Court') && !activeFilters.hc) return false
    if (c.court.includes('NCLT') && !activeFilters.tribunal) return false

    return true
  })

  const handleSaveToCase = (targetCaseId) => {
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
                    setActiveFilters({
                      ...activeFilters,
                      sc: !activeFilters.sc,
                    })
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
                    setActiveFilters({
                      ...activeFilters,
                      hc: !activeFilters.hc,
                    })
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
                    setActiveFilters({
                      ...activeFilters,
                      tribunal: !activeFilters.tribunal,
                    })
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
            <span className="text-xs font-medium text-slate-500 pt-1">
              Suggested:
            </span>
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
                {result.court}   {result.date}   {result.bench}
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
              <Plus size={16} /> Add to Case
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
              <p className="text-yellow-900 leading-normal">
                {selectedCase.summary}
              </p>
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
      {showSaveModal && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              Add Citation to Matter
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Select which active matter you want to attach{' '}
              <b>{selectedCase.citation}</b> to:
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
                  <div className="text-xs text-slate-500">{c.client}</div>
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

// --- Other Components (Editor, CaseList, CaseDetail) ---

const Editor = ({ initialContent, contextCase, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      text: 'Hello, Advocate. I am your Legal Co-Pilot. I can help you draft clauses, review risks, or format citations based on this case context.',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filesPanelOpen, setFilesPanelOpen] = useState(
    Boolean(contextCase?.artifacts && contextCase.artifacts.length > 0),
  )
  const editorRef = useRef(null)

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

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMsgs = [...messages, { role: 'user', text: chatInput }]
    setMessages(newMsgs)
    setChatInput('')
    setIsGenerating(true)

    setTimeout(() => {
      let aiResponseText = 'I can certainly help with that.'
      let suggestedAction = null

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

  const executeAIAction = (action) => {
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
                      onClick={() => executeAIAction(msg.action)}
                      className="flex items-center gap-2 w-full p-2 bg-white border border-orange-200 rounded-lg shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-all text-xs font-medium text-orange-700 group"
                    >
                      {msg.action.type === 'insert_text' ? (
                        <Plus size={14} />
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

const CaseList = ({ cases, onSelectCase, onOpenCreate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-8 py-6 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Matter Manager</h1>
          <p className="text-slate-500 text-sm mt-1">
            Active litigations, filings, and advisory.
          </p>
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
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {c.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.client}</td>
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

const CaseDetail = ({ caseData, onBack, onOpenEditor }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedArtifact, setSelectedArtifact] = useState(null)
  const [noteInput, setNoteInput] = useState('')

  // Adapt older data shape into the richer structure expected by the new UI
  const stages = caseData.stages || ['Intake', 'Drafting', 'Discovery', 'Hearing', 'Closing']
  const statusToStageIndex = {
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
    id: d.id ?? idx + 1,
    task: d.task,
    date: d.date,
    urgent: d.urgent ?? false,
  }))

  const notesArray = Array.isArray(caseData.notes)
    ? caseData.notes
    : [
        {
          id: 1,
          author: 'Case Notes',
          date: caseData.lastUpdated || 'Recent',
          text: caseData.notes || 'No notes added yet.',
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
              <UploadCloud size={16} />
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
                <p className="text-sm font-medium text-slate-900 truncate">
                  {art.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {art.date} • {art.size || 'Document'}
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
                  {selectedArtifact.summary || 'No analysis available yet.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">
                    Uploaded Date
                  </span>
                  <span className="text-sm text-slate-900">
                    {selectedArtifact.date}
                  </span>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {caseData.title}
            </h1>
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
              onClick={() => setActiveTab(tab)}
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
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Client
                    </p>
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
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Opposing
                    </p>
                    <p className="font-medium text-slate-900">{opposing.name}</p>
                    <p className="text-xs text-slate-600 mt-1">{opposing.counsel}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Phone size={12} /> {opposing.phone}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Presiding
                    </p>
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
                          <span className="text-xs font-bold text-slate-500">
                            {note.date}
                          </span>
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
                          d.urgent
                            ? 'bg-rose-50 border-rose-100'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div
                          className={`mt-1 ${
                            d.urgent ? 'text-rose-500' : 'text-slate-400'
                          }`}
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

// --- Main App ---

function LawCentralApp() {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedCase, setSelectedCase] = useState(null)
  const [editorContext, setEditorContext] = useState(null)
  const [cases, setCases] = useState(MOCK_CASES)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateCase = (newCaseData) => {
    const newCase = {
      id: `C-2024-${Math.floor(Math.random() * 900) + 100}`,
      ...newCaseData,
      status: 'Intake',
      lastUpdated: 'Just now',
      deadlines: [],
      artifacts: [],
    }
    setCases([newCase, ...cases])
    setIsCreateModalOpen(false)

    // Auto-navigate to the new case
    setSelectedCase(newCase)
    setActiveView('case-detail')
    navigate('/case-detail')
  }

  const handleAddCitationToCase = (citationData, targetCaseId) => {
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

  const handleNavigate = (view, data = null) => {
    if (view === 'dashboard') {
      setActiveView('dashboard')
      navigate('/dashboard')
    } else if (view === 'cases' && data) {
      setSelectedCase(cases.find((c) => c.id === data.id))
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
      setActiveView(view)
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
      case 'editor':
        return (
          <Editor
            contextCase={editorContext}
            onClose={() => setActiveView(editorContext ? 'case-detail' : 'dashboard')}
          />
        )
      case 'research':
        return (
          <ResearchView cases={cases} onAddToCase={handleAddCitationToCase} />
        )
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        activeView={activeView === 'case-detail' ? 'cases' : activeView}
        setActiveView={handleNavigate}
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<LawCentralApp />} />
      </Routes>
    </BrowserRouter>
  )
}

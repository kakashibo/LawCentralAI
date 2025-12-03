import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle,
  FileText,
  Play,
  Scale,
  Shield,
  Sparkles,
  X,
  Zap,
  Menu,
} from 'lucide-react'

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
            onClick={() => setIsMenuOpen((open) => !open)}
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
            Manage cases, research Supreme Court precedents, and draft petitions with AI assistance.
            All in one secure, compliant platform built for Indian Advocates.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full md:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-900/20 transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight size={20} />
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
                      <p className="text-xs text-slate-500 font-bold uppercase">Task Completed</p>
                      <p className="text-sm font-bold text-slate-900">NCLT Filing Uploaded</p>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Top Advocates Switch to LawCentral</h2>
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
      <section className="py-24 overflow-hidden" id="research">
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
                Imagine an assistant that knows every detail of your case and every relevant Supreme
                Court judgment. Ask LawCentral to draft a clause, and it cites the precedent
                automatically.
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

export default LandingPage

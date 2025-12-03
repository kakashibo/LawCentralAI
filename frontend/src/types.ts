export interface CaseDeadline {
  id: number | string
  task: string
  date: string
  urgent?: boolean
}

export interface CaseArtifact {
  id: number | string
  name: string
  type: string
  date: string
  size?: string
  tags?: string[]
  summary?: string
}

export interface CaseNote {
  id: number | string
  author: string
  date: string
  text: string
  billable?: boolean
}

export interface CaseClient {
  name: string
  phone: string
  email: string
}

export interface CaseOpposing {
  name: string
  counsel: string
  phone: string
}

export interface CaseJudge {
  name: string
  court: string
}

export interface LegalCase {
  id: string
  title: string
  type: string
  status: string
  client: string | CaseClient
  lastUpdated: string
  deadlines: CaseDeadline[]
  artifacts: CaseArtifact[]
  notes?: string | CaseNote[]
  stages?: string[]
  currentStage?: number
  opposing?: CaseOpposing
  judge?: CaseJudge
}

export type ResearchStatus = 'good_law' | 'distinguished' | string

export interface ResearchCase {
  id: string
  citation: string
  title: string
  court: string
  date: string
  bench: string
  tags: string[]
  status: ResearchStatus
  snippet: string
  summary: string
  judgement_text: string
}

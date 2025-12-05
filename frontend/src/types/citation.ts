export interface CitationNode {
  id: string
  citation: string
  title: string
  year: number
  court: string
  importance: number // 1-5, affects node size
  type: 'cited' | 'citing' | 'central' // central is the current case
}

export interface CitationLink {
  source: string
  target: string
  type: 'cited_by' | 'refers_to' | 'overruled' | 'followed' | 'distinguished'
  strength: number // 1-3, affects line thickness
}

export interface CitationGraph {
  nodes: CitationNode[]
  links: CitationLink[]
}

import { useState } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import CitationGraphVisualizer from './CitationGraphVisualizer'
import { MOCK_CITATION_GRAPH } from '../../mockData/citationGraph'
import type { CitationNode } from '../../types/citation'

const CitationsView = () => {
  const [selectedCase, setSelectedCase] = useState<CitationNode | null>(null)

  const handleNodeClick = (node: CitationNode) => {
    setSelectedCase(node)
    console.log('Selected case:', node)
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Panel - Case Details */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="font-bold text-lg text-slate-800">Citation Analysis</h1>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-orange-900">Current Case</h3>
                <p className="text-xs text-orange-700 mt-1">
                  {MOCK_CITATION_GRAPH.nodes.find((n) => n.type === 'central')?.citation}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {MOCK_CITATION_GRAPH.nodes.find((n) => n.type === 'central')?.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedCase ? (
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-3">Selected Case Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500">Citation</label>
                  <p className="text-sm text-slate-800 font-mono">{selectedCase.citation}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Case Title</label>
                  <p className="text-sm text-slate-800">{selectedCase.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Year</label>
                    <p className="text-sm text-slate-800">{selectedCase.year}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Importance</label>
                    <p className="text-sm text-slate-800">{selectedCase.importance}/5</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Court</label>
                  <p className="text-sm text-slate-800">{selectedCase.court}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Type</label>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedCase.type === 'central'
                        ? 'bg-orange-100 text-orange-700'
                        : selectedCase.type === 'citing'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {selectedCase.type === 'central'
                      ? 'Current Case'
                      : selectedCase.type === 'citing'
                        ? 'Citing Case'
                        : 'Cited Case'}
                  </span>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors">
                  View Full Judgment
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <FileText size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Click on a node to see case details</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Citation Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Cases</span>
                <span className="font-medium text-slate-800">
                  {MOCK_CITATION_GRAPH.nodes.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cases Cited</span>
                <span className="font-medium text-blue-600">
                  {MOCK_CITATION_GRAPH.nodes.filter((n) => n.type === 'cited').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Citing Cases</span>
                <span className="font-medium text-purple-600">
                  {MOCK_CITATION_GRAPH.nodes.filter((n) => n.type === 'citing').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Citations</span>
                <span className="font-medium text-slate-800">
                  {MOCK_CITATION_GRAPH.links.length}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Citation Types</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-green-500" />
                    <span className="text-slate-600">Followed</span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {MOCK_CITATION_GRAPH.links.filter((l) => l.type === 'followed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-red-500" />
                    <span className="text-slate-600">Overruled</span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {MOCK_CITATION_GRAPH.links.filter((l) => l.type === 'overruled').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-amber-500" />
                    <span className="text-slate-600">Distinguished</span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {MOCK_CITATION_GRAPH.links.filter((l) => l.type === 'distinguished').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-indigo-500" />
                    <span className="text-slate-600">Refers To</span>
                  </div>
                  <span className="font-medium text-slate-800">
                    {MOCK_CITATION_GRAPH.links.filter((l) => l.type === 'refers_to').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Graph Visualization */}
      <div className="flex-1 p-4">
        <CitationGraphVisualizer
          data={MOCK_CITATION_GRAPH}
          width={1200}
          height={800}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  )
}

export default CitationsView

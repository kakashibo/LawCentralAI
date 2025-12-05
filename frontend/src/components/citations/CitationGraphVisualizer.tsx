import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Network, ZoomIn, ZoomOut, Maximize2, Download, Info } from 'lucide-react'
import type { CitationGraph, CitationNode, CitationLink } from '../../types/citation'

interface CitationGraphVisualizerProps {
  data: CitationGraph
  width?: number
  height?: number
  onNodeClick?: (node: CitationNode) => void
}

const CitationGraphVisualizer = ({
  data,
  width = 900,
  height = 600,
  onNodeClick,
}: CitationGraphVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<CitationNode | null>(null)
  const [showLegend, setShowLegend] = useState(true)

  useEffect(() => {
    if (!svgRef.current || !data) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
    const container = svg.append('g')

    // Define arrow markers for directed edges
    const defs = svg.append('defs')

    const markerColors = {
      followed: '#10b981',
      overruled: '#ef4444',
      distinguished: '#f59e0b',
      refers_to: '#6366f1',
      cited_by: '#8b5cf6',
    }

    Object.entries(markerColors).forEach(([type, color]) => {
      defs
        .append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
    })

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create force simulation
    const simulation = d3
      .forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // Create links
    const link = container
      .append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', (d) => markerColors[d.type] || '#94a3b8')
      .attr('stroke-width', (d) => d.strength)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', (d) => `url(#arrow-${d.type})`)

    // Create nodes
    const node = container
      .append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(
        d3
          .drag<SVGGElement, CitationNode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', (d) => 10 + d.importance * 4)
      .attr('fill', (d) => {
        if (d.type === 'central') return '#f97316'
        if (d.type === 'citing') return '#8b5cf6'
        return '#3b82f6'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
        onNodeClick?.(d)
      })
      .on('mouseenter', function () {
        d3.select(this).attr('stroke-width', 4)
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-width', 2)
      })

    // Add labels
    node
      .append('text')
      .text((d) => d.citation)
      .attr('font-size', '10px')
      .attr('dx', 15)
      .attr('dy', -10)
      .attr('fill', '#1e293b')
      .attr('font-weight', (d) => (d.type === 'central' ? 'bold' : 'normal'))
      .style('pointer-events', 'none')

    // Add case titles on hover
    node.append('title').text((d) => `${d.citation}\n${d.title}\n${d.year}`)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [data, width, height, onNodeClick])

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3)
    }
  }

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7)
    }
  }

  const handleReset = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity)
    }
  }

  const handleExport = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'citation-graph.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Network className="text-orange-600" size={20} />
          <h2 className="font-bold text-slate-800">Citation Graph</h2>
          <span className="text-xs text-slate-500">
            ({data.nodes.length} cases, {data.links.length} citations)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            title="Toggle Legend"
          >
            <Info size={18} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            title="Reset View"
          >
            <Maximize2 size={18} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            title="Export as SVG"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} width={width} height={height} className="w-full h-full" />

        {/* Legend */}
        {showLegend && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-slate-200 shadow-lg text-sm">
            <h3 className="font-bold text-slate-800 mb-3">Legend</h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-600 border-2 border-white" />
                <span className="text-slate-700">Current Case</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                <span className="text-slate-700">Cases Cited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-600 border-2 border-white" />
                <span className="text-slate-700">Citing Cases</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-green-500" />
                <span className="text-slate-700">Followed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-red-500" />
                <span className="text-slate-700">Overruled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-amber-500" />
                <span className="text-slate-700">Distinguished</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-indigo-500" />
                <span className="text-slate-700">Refers To</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 italic">
              Drag nodes to reposition • Scroll to zoom
            </p>
          </div>
        )}

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-slate-200 shadow-lg max-w-sm">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-slate-800">{selectedNode.citation}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-slate-700 mb-2">{selectedNode.title}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{selectedNode.court}</span>
              <span>•</span>
              <span>{selectedNode.year}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedNode.type === 'central'
                    ? 'bg-orange-100 text-orange-700'
                    : selectedNode.type === 'citing'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {selectedNode.type === 'central'
                  ? 'Current Case'
                  : selectedNode.type === 'citing'
                    ? 'Citing Case'
                    : 'Cited Case'}
              </span>
              <span className="text-xs text-slate-500">Importance: {selectedNode.importance}/5</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex gap-4">
          <span>
            Cases Cited: {data.nodes.filter((n) => n.type === 'cited').length}
          </span>
          <span>Citing Cases: {data.nodes.filter((n) => n.type === 'citing').length}</span>
        </div>
        <div className="flex gap-4">
          <span>
            Followed: {data.links.filter((l) => l.type === 'followed').length}
          </span>
          <span>
            Overruled: {data.links.filter((l) => l.type === 'overruled').length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CitationGraphVisualizer

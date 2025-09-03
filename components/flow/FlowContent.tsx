'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow'

import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'
import { SourceNode } from './nodes/SourceNode'
import { ProcessorNode } from './nodes/ProcessorNode'
import { OutcomeNode } from './nodes/OutcomeNode'
import { EnhancedProductFilterNode } from './nodes/EnhancedProductFilterNode'
import { AnimatedEdge } from './edges/AnimatedEdge'
import { BottleneckPanel } from '@/components/ui/BottleneckPanel'
import { ScenarioPanel } from '@/components/ui/ScenarioPanel'
import { MarkovAnalysisPanel } from '@/components/ui/MarkovAnalysisPanel'
import { CohortAnalysisPanel } from '@/components/ui/CohortAnalysisPanel'

// Define all constants at module level - these will never be recreated
const nodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  outcome: OutcomeNode,
  enhancedProductFilter: EnhancedProductFilterNode,
}

const edgeTypes = {
  animated: AnimatedEdge,
}

const defaultEdgeOptions = {
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: '#3b82f6',
  },
}

const fitViewOptions = {
  padding: 0.2,
}

const minimapStyle = {
  backgroundColor: '#f3f4f6',
}

const getNodeColor = (node: any) => {
  switch (node.type) {
    case 'source':
      return '#8b5cf6'
    case 'processor':
      return '#3b82f6'
    case 'outcome':
      return '#10b981'
    default:
      return '#6b7280'
  }
}

export function FlowContent() {
  const nodes = useImprovedFlowStore((state) => state.nodes)
  const edges = useImprovedFlowStore((state) => state.edges)
  const onNodesChange = useImprovedFlowStore((state) => state.onNodesChange)
  const onEdgesChange = useImprovedFlowStore((state) => state.onEdgesChange)
  const onConnect = useImprovedFlowStore((state) => state.onConnect)
  const setSelectedNode = useImprovedFlowStore((state) => state.setSelectedNode)
  const calculateFlow = useImprovedFlowStore((state) => state.calculateFlow)

  // Memoize node and edge types to prevent React Flow warnings
  const memoizedNodeTypes = useMemo(() => nodeTypes, [])
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [])

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node.id)
  }, [setSelectedNode])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // Initial calculation on mount only
  useEffect(() => {
    calculateFlow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full h-screen bg-gray-50" style={{ width: '100%', height: '100vh' }}>
      <MarkovAnalysisPanel />
      <BottleneckPanel />
      <ScenarioPanel />
      <CohortAnalysisPanel />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={false}
        snapGrid={[1, 1]}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        selectionOnDrag={false}
      >
        <Controls />
        <MiniMap 
          nodeColor={getNodeColor}
          style={minimapStyle}
          maskColor="rgb(50, 50, 50, 0.8)"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
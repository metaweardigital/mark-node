'use client'

import React, { useCallback, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow'

import { useFlowStore } from '@/lib/store/flowStore'
import { SourceNode } from './nodes/SourceNode'
import { ProcessorNode } from './nodes/ProcessorNode'
import { OutcomeNode } from './nodes/OutcomeNode'
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
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)
  const onNodesChange = useFlowStore((state) => state.onNodesChange)
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange)
  const onConnect = useFlowStore((state) => state.onConnect)
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode)
  const calculateFlow = useFlowStore((state) => state.calculateFlow)

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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={false}
        snapGrid={[1, 1]}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        panOnDrag={false}
        selectionOnDrag={false}
        autoPanOnNodeDrag={false}
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
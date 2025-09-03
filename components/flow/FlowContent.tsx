'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow'

import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'
import { EnhancedSourceNode } from './nodes/EnhancedSourceNode'
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
  source: EnhancedSourceNode,
  processor: ProcessorNode,
  outcome: OutcomeNode,
  enhancedProductFilter: EnhancedProductFilterNode,
}

const edgeTypes = {
  animated: AnimatedEdge,
}

const defaultEdgeOptions = {
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
  const initMatomoClient = useImprovedFlowStore((state) => state.initMatomoClient)
  const fetchVisitorMetrics = useImprovedFlowStore((state) => state.fetchVisitorMetrics)
  const updateNodeFilter = useImprovedFlowStore((state) => state.updateNodeFilter)

  // Memoize node and edge types to prevent React Flow warnings
  const memoizedNodeTypes = useMemo(() => nodeTypes, [])
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [])

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node.id)
  }, [setSelectedNode])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // Initialize Matomo and calculate flow on mount
  useEffect(() => {
    // Initialize Matomo client with all site mappings
    const HARDCODED_MAPPINGS: Record<string, number> = {
      // CzechAV sites
      'czechav': 16, 'czechamateurs': 15, 'czechbangbus': 17, 'czechbitch': 18,
      'czechcabins': 19, 'czechcasting': 20, 'czechcouples': 21, 'czechdellais': 22,
      'czechestrogenolit': 23, 'czechexperiment': 24, 'czechfantasy': 25,
      'czechfirstvideo': 26, 'czechgangbang': 27, 'czechgardenparty': 28,
      'czechharem': 29, 'czechhomeorgy': 30, 'czechjacker': 31, 'czechlesbians': 32,
      'czechmassage': 33, 'czechmegaswingers': 34, 'czechorgasm': 35,
      'czechparties': 36, 'czechpawnshop': 37, 'czechpool': 38, 'czechsauna': 39,
      'czechsnooper': 40, 'czechsolarium': 41, 'czechspy': 42, 'czechstreets': 46,
      'czechstudents': 47, 'czechsupermodels': 48, 'czechtantra': 49,
      'czechtaxi': 50, 'czechwifeswap': 51,
      // CzechGAV sites
      'czechgav': 82, 'czechgayamateurs': 83, 'czechgaycasting': 84,
      'czechgaycouples': 85, 'czechgayfantasy': 86, 'czechgaymassage': 87,
      'czechgaysolarium': 88, 'gayhorrorporn': 56,
      // GoPerv sites
      'goperv': 57, 'perversefamily': 59, 'perversefamilylive': 60,
      'extremestreets': 55, 'dirtysarah': 54, 'powerfetish': 62,
      'xvirtual': 65, 'horrorporn': 58, 'r51': 63,
      // XXL sites
      'annalovesshemale': 77, 'monstercockgang': 78, 'redneckjohn': 79,
      'unusualpeople': 80, 'mikebigdick': 81,
      // NUDZ sites
      'nudz': 73, 'glaminogirls': 69, 'lifepornstories': 70, 'unrealporn': 76,
      'creativeporn': 66, 'spy26': 74, 'movieporn': 72, 'loveasmr': 71,
      'ghost-porn': 68, 'fuckmesensei': 67, 'therapyasmr': 75
    }
    
    initMatomoClient({
      baseUrl: process.env.NEXT_PUBLIC_MATOMO_URL || '',
      authToken: process.env.NEXT_PUBLIC_MATOMO_AUTH_TOKEN || '',
      defaultPeriod: 'month',
      cacheTimeout: 15
    }, HARDCODED_MAPPINGS)
    
    // Calculate flow first to setup the flow
    calculateFlow()
    
    // Trigger the traffic source node to fetch initial data
    // This will use the updateNodeFilter which properly triggers the fetch
    setTimeout(() => {
      console.log('[FlowContent] Triggering initial data fetch via traffic source filter...')
      // Update the traffic source node filter to 'all' which will trigger the fetch
      updateNodeFilter('traffic_source', 'all', 'all')
    }, 100)
    
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
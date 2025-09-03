import { Node, Edge, Connection } from 'reactflow'

export type NodeType = 'source' | 'processor' | 'outcome'

export interface NodeData {
  label: string
  value: number
  unit: 'visitors' | 'users' | 'percentage' | 'currency'
  isAdjustable: boolean
  min?: number
  max?: number
  step?: number
  formula?: string
  successRate?: number
  trend?: number
  description?: string
}

export type FlowNode = Node<NodeData>

export interface EdgeData {
  value: number
  conversionRate: number
  status: 'optimal' | 'warning' | 'critical'
}

export type FlowEdge = Edge<EdgeData>

export interface FlowState {
  nodes: FlowNode[]
  edges: FlowEdge[]
  selectedNode: string | null
  isCalculating: boolean
}

export interface Scenario {
  id: string
  name: string
  description?: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  createdAt: Date
  updatedAt: Date
}

export interface MarkovState {
  id: string
  label: string
  isAbsorbing: boolean
}

export interface TransitionMatrix {
  states: MarkovState[]
  probabilities: number[][]
  timeStep: 'daily' | 'weekly' | 'monthly'
}
import { SourceNode } from './nodes/SourceNode'
import { ProcessorNode } from './nodes/ProcessorNode'
import { OutcomeNode } from './nodes/OutcomeNode'

// Export node types as a constant to ensure they're never recreated
export const nodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  outcome: OutcomeNode,
} as const

export type NodeTypes = typeof nodeTypes
import { DefaultEdgeOptions } from 'reactflow'

// Define default edge options
export const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: '#3b82f6',
  },
}

// Define fitView options
export const fitViewOptions = {
  padding: 0.2,
}

// Define minimap style
export const minimapStyle = {
  backgroundColor: '#f3f4f6',
}

// Define node color mapping for minimap
export const getNodeColor = (node: any) => {
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
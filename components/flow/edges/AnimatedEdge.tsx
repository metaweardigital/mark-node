import React from 'react'
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow'

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Determine edge color based on status
  const getEdgeColor = () => {
    if (!data?.status) return '#3b82f6'
    switch (data.status) {
      case 'optimal':
        return '#10b981'
      case 'warning':
        return '#f59e0b'
      case 'critical':
        return '#ef4444'
      default:
        return '#3b82f6'
    }
  }

  // Calculate stroke width based on value
  const getStrokeWidth = () => {
    return 2 // Consistent thickness for all edges
  }

  const edgeColor = getEdgeColor()
  const strokeWidth = getStrokeWidth()

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth,
          opacity: 1,
          strokeDasharray: '3 3',
          animation: 'flow-animation 1.5s linear infinite',
        }}
      />
      {data?.conversionRate && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 11,
              fontWeight: 500,
              background: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${edgeColor}`,
              color: edgeColor,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {data.conversionRate.toFixed(1)}%
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
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
    if (!data?.value) return 2
    // Logarithmic scale for better visualization
    const width = Math.log10(data.value + 1) * 0.8 + 1
    return Math.min(Math.max(width, 2), 8)
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
          opacity: 0.6,
        }}
      />
      <BaseEdge
        id={`${id}-animated`}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth: strokeWidth * 0.5,
          opacity: 0.8,
          strokeDasharray: '10 20',
          animation: `flow 2s linear infinite`,
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
      <style jsx>{`
        @keyframes flow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -30;
          }
        }
      `}</style>
    </>
  )
}
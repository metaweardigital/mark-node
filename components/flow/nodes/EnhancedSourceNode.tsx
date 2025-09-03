import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Users, TrendingUp, Clock, MousePointer } from 'lucide-react'
import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'

interface SourceNodeData {
  label: string
  value: number
  unit: string
  isAdjustable: boolean
  dataSource?: 'static' | 'matomo' | 'loading'
  metrics?: {
    daily: number
    monthly: number
    visits: number
    bounceRate: number
    avgTimeOnSite: number
  }
  min?: number
  max?: number
  step?: number
}

export function EnhancedSourceNode({ id, data, selected }: NodeProps<SourceNodeData>) {
  const updateNodeValue = useImprovedFlowStore((state) => state.updateNodeValue)

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Format time in minutes
  const formatTime = (seconds: number) => {
    const totalSeconds = Math.round(seconds) // Round to nearest whole second
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const isLiveData = data.dataSource === 'matomo' && data.metrics

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-lg min-w-[220px]
        bg-gradient-to-br from-purple-500 to-purple-700
        border-2 ${selected ? 'border-white' : 'border-purple-600'}
        text-white
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span className="font-semibold text-sm">{data.label}</span>
        </div>
        {data.dataSource === 'loading' && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Loading...</span>
          </div>
        )}
        {isLiveData && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Live</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        {/* Main visitor count */}
        {data.isAdjustable ? (
          <input
            type="number"
            value={data.value}
            onChange={(e) => updateNodeValue(id, parseFloat(e.target.value))}
            onClick={handleInputClick}
            onMouseDown={handleInputMouseDown}
            min={data.min}
            max={data.max}
            step={data.step}
            className="
              nodrag
              bg-white/20 backdrop-blur-sm rounded px-2 py-1
              text-white text-xl font-bold text-center
              border border-white/30
              focus:outline-none focus:ring-2 focus:ring-white/50
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold">
              {data.value.toLocaleString()}
            </div>
            <div className="text-xs text-white/70">
              {data.unit}
            </div>
          </div>
        )}

        {/* Matomo metrics */}
        {isLiveData && data.metrics && (
          <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
            {/* Daily average */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Daily Avg:</span>
              <span className="font-medium">{data.metrics.daily.toLocaleString()}</span>
            </div>
            
            {/* Total visits vs unique */}
            {data.metrics.visits && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  <span className="text-white/70">Total Visits:</span>
                </div>
                <span className="font-medium">{data.metrics.visits.toLocaleString()}</span>
              </div>
            )}
            
            {/* Bounce rate */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <MousePointer size={12} />
                <span className="text-white/70">Bounce Rate:</span>
              </div>
              <span className={`font-medium ${data.metrics.bounceRate > 80 ? 'text-yellow-300' : ''}`}>
                {data.metrics.bounceRate.toFixed(1)}%
              </span>
            </div>
            
            {/* Avg time on site */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className="text-white/70">Avg Time:</span>
              </div>
              <span className="font-medium">
                {formatTime(data.metrics.avgTimeOnSite)}
              </span>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="w-3 h-3 bg-white border-2 border-purple-600"
      />
    </div>
  )
}
import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Settings, TrendingUp, TrendingDown } from 'lucide-react'
import { NodeData } from '@/types/flow.types'
import { useFlowStore } from '@/lib/store/flowStore'

export function ProcessorNode({ id, data, selected }: NodeProps<NodeData>) {
  const updateNodeValue = useFlowStore((state) => state.updateNodeValue)

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === 'currency') return `$${value.toFixed(2)}`
    if (unit === 'percentage') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-lg min-w-[180px]
        bg-gradient-to-br from-blue-500 to-blue-700
        border-2 ${selected ? 'border-white' : 'border-blue-600'}
        text-white relative
      `}
    >
      {data.successRate && (
        <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold shadow">
          {data.successRate.toFixed(1)}%
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <Settings size={16} />
        <span className="font-semibold text-sm">{data.label}</span>
      </div>
      
      <div className="flex flex-col gap-1">
        {data.isAdjustable ? (
          <div className="relative">
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
                w-full bg-white/20 backdrop-blur-sm rounded px-2 py-1
                text-white text-lg font-bold text-center
                border border-white/30
                focus:outline-none focus:ring-2 focus:ring-white/50
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
              "
            />
            {data.unit === 'currency' && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70">$</span>
            )}
            {data.unit === 'percentage' && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70">%</span>
            )}
          </div>
        ) : (
          <div className="text-lg font-bold text-center">
            {formatValue(data.value, data.unit)}
          </div>
        )}
        
        {data.trend !== undefined && data.trend !== 0 && (
          <div className={`flex items-center justify-center gap-1 text-xs ${data.trend > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {data.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(data.trend).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="w-3 h-3 bg-white border-2 border-blue-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="w-3 h-3 bg-white border-2 border-blue-600"
      />
    </div>
  )
}
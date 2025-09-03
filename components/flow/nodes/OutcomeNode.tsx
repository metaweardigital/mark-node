import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { NodeData } from '@/types/flow.types'

export function OutcomeNode({ data, selected }: NodeProps<NodeData>) {
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-lg min-w-[180px]
        bg-gradient-to-br from-green-500 to-green-700
        border-2 ${selected ? 'border-white' : 'border-green-600'}
        text-white relative
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={16} />
        <span className="font-semibold text-sm">{data.label}</span>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold text-center">
          {formatValue(data.value)}
        </div>
        
        {data.trend !== undefined && data.trend !== 0 && (
          <div className={`flex items-center justify-center gap-1 text-xs ${data.trend > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {data.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{data.trend > 0 ? '+' : ''}{data.trend.toFixed(1)}%</span>
          </div>
        )}

        {data.description && (
          <div className="text-xs text-white/70 text-center mt-1">
            {data.description}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="w-3 h-3 bg-white border-2 border-green-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="w-3 h-3 bg-white border-2 border-green-600"
      />
    </div>
  )
}
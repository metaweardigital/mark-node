import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Users } from 'lucide-react'
import { NodeData } from '@/types/flow.types'
import { useFlowStore } from '@/lib/store/flowStore'

export function SourceNode({ id, data, selected }: NodeProps<NodeData>) {
  const updateNodeValue = useFlowStore((state) => state.updateNodeValue)

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleInputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className={`
        px-4 py-3 rounded-lg shadow-lg min-w-[180px]
        bg-gradient-to-br from-purple-500 to-purple-700
        border-2 ${selected ? 'border-white' : 'border-purple-600'}
        text-white
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <Users size={16} />
        <span className="font-semibold text-sm">{data.label}</span>
      </div>
      
      <div className="flex flex-col gap-1">
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
              text-white text-lg font-bold text-center
              border border-white/30
              focus:outline-none focus:ring-2 focus:ring-white/50
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        ) : (
          <div className="text-lg font-bold text-center">
            {data.value.toLocaleString()}
          </div>
        )}
        <div className="text-xs text-white/70 text-center">
          {data.unit === 'currency' ? '$' : ''}{data.unit !== 'currency' ? data.unit : ''}
        </div>
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
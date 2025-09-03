import React, { useCallback, memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'
import { PRODUCT_STATS } from '@/lib/config/realPricing'

interface ProductFilterNodeData {
  label: string
  filter: 'all' | 'networks' | 'sites'
  stats?: {
    networks: number
    sites: number
    avgPrice: number
  }
}

interface ProductFilterNodeProps {
  data: ProductFilterNodeData
  id: string
  selected: boolean
}

const ProductFilterNode = memo(({ data, id, selected }: ProductFilterNodeProps) => {
  const updateNodeFilter = useImprovedFlowStore((state) => state.updateNodeFilter)

  const handleFilterChange = useCallback((value: string) => {
    updateNodeFilter(id, value as 'all' | 'networks' | 'sites')
  }, [id, updateNodeFilter])

  return (
    <div className={`bg-white rounded-lg border-2 ${selected ? 'border-blue-500' : 'border-gray-200'} p-4 min-w-[250px] shadow-lg`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">{data.label}</h3>
        
        <Select value={data.filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full nodrag">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="nodrag">
            <SelectItem value="all">
              <div className="flex items-center justify-between w-full">
                <span>All Products</span>
                <span className="text-xs text-gray-500 ml-2">
                  {PRODUCT_STATS.totalNetworks + PRODUCT_STATS.totalSites}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="networks">
              <div className="flex items-center justify-between w-full">
                <span>Networks Only</span>
                <span className="text-xs text-gray-500 ml-2">
                  {PRODUCT_STATS.totalNetworks}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="sites">
              <div className="flex items-center justify-between w-full">
                <span>Individual Sites</span>
                <span className="text-xs text-gray-500 ml-2">
                  {PRODUCT_STATS.totalSites}
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-purple-50 rounded p-2">
            <div className="text-gray-600">Networks</div>
            <div className="font-semibold text-purple-700">
              {data.filter === 'sites' ? 0 : PRODUCT_STATS.activeNetworks}
            </div>
          </div>
          <div className="bg-blue-50 rounded p-2">
            <div className="text-gray-600">Sites</div>
            <div className="font-semibold text-blue-700">
              {data.filter === 'networks' ? 0 : PRODUCT_STATS.activeSites}
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  )
})

ProductFilterNode.displayName = 'ProductFilterNode'

export { ProductFilterNode }
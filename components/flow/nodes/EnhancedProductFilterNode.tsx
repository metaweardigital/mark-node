import React, { useCallback, memo, useState, useEffect } from 'react'
import { Handle, Position } from 'reactflow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'
import { NETWORKS, SITES, PRODUCT_STATS } from '@/lib/config/realPricing'

interface EnhancedProductFilterNodeData {
  label: string
  mainFilter: 'all' | 'networks' | 'sites'
  subFilter: string // 'all' or specific id
  selectedNetwork?: string
  selectedSite?: string
  timePeriod?: string // 'today', 'yesterday', 'last7', 'last30', '2024-08', etc.
  stats?: {
    networks: number
    sites: number
    avgPrice: number
    selectedPrice?: number
  }
}

interface EnhancedProductFilterNodeProps {
  data: EnhancedProductFilterNodeData
  id: string
  selected: boolean
}

const EnhancedProductFilterNode = memo(({ data, id, selected }: EnhancedProductFilterNodeProps) => {
  const updateNodeFilter = useImprovedFlowStore((state) => state.updateNodeFilter)
  const updateNodePeriod = useImprovedFlowStore((state) => state.updateNodePeriod)
  const [mainFilter, setMainFilter] = useState(data.mainFilter || 'all')
  const [subFilter, setSubFilter] = useState(data.subFilter || 'all')
  const [timePeriod, setTimePeriod] = useState(data.timePeriod || 'today')

  const handleMainFilterChange = useCallback((value: string) => {
    setMainFilter(value as 'all' | 'networks' | 'sites')
    setSubFilter('all') // Reset sub-filter when main changes
    updateNodeFilter(id, value as 'all' | 'networks' | 'sites', 'all')
  }, [id, updateNodeFilter])

  const handleSubFilterChange = useCallback((value: string) => {
    setSubFilter(value)
    updateNodeFilter(id, mainFilter, value)
  }, [id, mainFilter, updateNodeFilter])

  const handleTimePeriodChange = useCallback((value: string) => {
    setTimePeriod(value)
    updateNodePeriod(value)
  }, [updateNodePeriod])

  // Get all networks (including waiting ones as they have active sites)
  // Networks with waiting status still have active sites that can be purchased
  const activeNetworks = NETWORKS
  const activeSites = SITES.filter(s => s.status === 'Active')

  // Calculate what to show based on filters
  const getDisplayStats = () => {
    if (mainFilter === 'all') {
      return {
        networks: activeNetworks.length,
        sites: activeSites.length,
        label: 'All Products'
      }
    } else if (mainFilter === 'networks') {
      if (subFilter === 'all') {
        return {
          networks: activeNetworks.length,
          sites: 0,
          label: 'All Networks'
        }
      } else {
        const network = NETWORKS.find(n => n.id === subFilter)
        return {
          networks: 1,
          sites: 0,
          label: network?.name || 'Network'
        }
      }
    } else { // sites
      if (subFilter === 'all') {
        return {
          networks: 0,
          sites: activeSites.length,
          label: 'All Individual Sites'
        }
      } else {
        return {
          networks: 0,
          sites: 1,
          label: subFilter
        }
      }
    }
  }

  const stats = getDisplayStats()

  return (
    <div className={`bg-white rounded-lg border-2 ${selected ? 'border-blue-500' : 'border-gray-200'} p-4 min-w-[280px] shadow-lg`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">{data.label}</h3>
        
        {/* Time Period Selector */}
        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
          <SelectTrigger className="w-full nodrag">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="nodrag">
            <SelectItem value="today">This Month</SelectItem>
            <SelectItem value="2024-08">August 2024</SelectItem>
            <SelectItem value="2024-07">July 2024</SelectItem>
            <SelectItem value="2024-06">June 2024</SelectItem>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Main Filter */}
        <Select value={mainFilter} onValueChange={handleMainFilterChange}>
          <SelectTrigger className="w-full nodrag">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="nodrag">
            <SelectItem value="all">
              <div className="flex items-center justify-between w-full">
                <span>All Products</span>
                <span className="text-xs text-gray-500 ml-2">
                  {activeNetworks.length + activeSites.length}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="networks">
              <div className="flex items-center justify-between w-full">
                <span>Networks</span>
                <span className="text-xs text-gray-500 ml-2">
                  {activeNetworks.length}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="sites">
              <div className="flex items-center justify-between w-full">
                <span>Individual Sites</span>
                <span className="text-xs text-gray-500 ml-2">
                  {activeSites.length}
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sub Filter - Only show when not "all" */}
        {mainFilter !== 'all' && (
          <Select value={subFilter} onValueChange={handleSubFilterChange}>
            <SelectTrigger className="w-full nodrag">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="nodrag max-h-[300px] overflow-y-auto">
              {mainFilter === 'networks' ? (
                <>
                  <SelectItem value="all">
                    <div className="flex items-center justify-between w-full">
                      <span>All Networks</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {activeNetworks.length}
                      </span>
                    </div>
                  </SelectItem>
                  {activeNetworks.map(network => (
                    <SelectItem key={network.id} value={network.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{network.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {network.sites.length} sites
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              ) : (
                <>
                  <SelectItem value="all">
                    <div className="flex items-center justify-between w-full">
                      <span>All Sites</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {activeSites.length}
                      </span>
                    </div>
                  </SelectItem>
                  {activeSites.map(site => (
                    <SelectItem key={site.id} value={site.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate max-w-[180px]">{site.id}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {site.network}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        )}

        <div className="bg-gray-50 rounded p-2 text-xs">
          <div className="font-semibold text-gray-700 mb-1">{stats.label}</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 rounded p-1.5">
              <div className="text-gray-600">Networks</div>
              <div className="font-semibold text-purple-700">
                {stats.networks}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-1.5">
              <div className="text-gray-600">Sites</div>
              <div className="font-semibold text-blue-700">
                {stats.sites}
              </div>
            </div>
          </div>
        </div>

        {/* Show specific pricing if single item selected */}
        {subFilter !== 'all' && mainFilter !== 'all' && (
          <div className="bg-yellow-50 rounded p-2 text-xs">
            <div className="text-gray-600">Selected Pricing</div>
            {mainFilter === 'networks' && (
              <>
                {NETWORKS.find(n => n.id === subFilter)?.pricing && (
                  <div className="font-semibold text-yellow-700">
                    €{NETWORKS.find(n => n.id === subFilter)?.pricing['1_month']}/mo
                  </div>
                )}
              </>
            )}
            {mainFilter === 'sites' && (
              <>
                {SITES.find(s => s.id === subFilter)?.pricing && (
                  <div className="font-semibold text-yellow-700">
                    €{SITES.find(s => s.id === subFilter)?.pricing['1_month']}/mo
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  )
})

EnhancedProductFilterNode.displayName = 'EnhancedProductFilterNode'

export { EnhancedProductFilterNode }
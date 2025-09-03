'use client'

import React from 'react'
import { AlertTriangle, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { useFlowStore } from '@/lib/store/flowStore'

export function BottleneckPanel() {
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  // Find the bottleneck (lowest conversion rate)
  const bottleneck = edges.reduce((min, edge) => {
    if (!edge.data?.conversionRate) return min
    if (!min || edge.data.conversionRate < min.data.conversionRate) {
      return edge
    }
    return min
  }, null as any)

  // Calculate potential revenue if bottleneck is fixed
  const calculatePotentialRevenue = () => {
    if (!bottleneck) return 0
    
    const visitors = nodes.find(n => n.id === '1')?.data.value || 0
    const price = nodes.find(n => n.id === '4')?.data.value || 0
    
    // Calculate current revenue
    const currentRevenue = nodes.find(n => n.id === '6')?.data.value || 0
    
    // Calculate potential with 10% improvement in bottleneck
    const improvedRate = Math.min(bottleneck.data.conversionRate * 1.1, 100)
    const improvementFactor = improvedRate / bottleneck.data.conversionRate
    const potentialRevenue = currentRevenue * improvementFactor
    
    return potentialRevenue - currentRevenue
  }

  const getBottleneckNode = () => {
    if (!bottleneck) return null
    return nodes.find(n => n.id === bottleneck.target)
  }

  const bottleneckNode = getBottleneckNode()
  const potentialGain = calculatePotentialRevenue()

  // Calculate overall flow health
  const averageConversion = edges.reduce((sum, edge) => {
    return sum + (edge.data?.conversionRate || 0)
  }, 0) / edges.filter(e => e.data?.conversionRate).length

  const healthScore = Math.round(averageConversion)
  const healthColor = healthScore > 75 ? 'text-green-500' : healthScore > 50 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm p-5 z-10 panel-enter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium">Flow Analysis</h3>
        <div className={`flex items-center gap-1.5 ${healthColor}`}>
          <Activity size={16} />
          <span className="font-semibold text-sm">{healthScore}%</span>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
          <div className="text-lg font-semibold">
            ${(nodes.find(n => n.id === '6')?.data.value || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Profit Margin</div>
          <div className="text-lg font-semibold">
            {((nodes.find(n => n.id === '7')?.data.value || 0) / 
              (nodes.find(n => n.id === '6')?.data.value || 1) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Bottleneck Alert */}
      {bottleneck && bottleneckNode && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-600 mt-0.5" size={14} />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">
                Bottleneck Detected
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {bottleneckNode.data.label} has only {bottleneck.data.conversionRate.toFixed(1)}% conversion rate
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <TrendingDown size={12} />
                <span>Limiting factor in your revenue flow</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Potential Gain */}
      {potentialGain > 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <DollarSign className="text-green-600 mt-0.5" size={14} />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">
                Optimization Opportunity
              </div>
              <div className="text-xs text-gray-500">
                Improving bottleneck by 10% could gain:
              </div>
              <div className="text-base font-semibold text-green-600 mt-1">
                +${potentialGain.toLocaleString()}/month
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="border-t pt-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Recommendations</div>
        <ul className="space-y-1">
          {bottleneck && (
            <li className="text-xs text-gray-500 flex items-start gap-1">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Focus on improving {bottleneckNode?.data.label} conversion</span>
            </li>
          )}
          {healthScore < 50 && (
            <li className="text-xs text-gray-500 flex items-start gap-1">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Overall flow health needs attention</span>
            </li>
          )}
          {edges.some(e => e.data?.status === 'warning') && (
            <li className="text-xs text-gray-500 flex items-start gap-1">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Review yellow warning indicators</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
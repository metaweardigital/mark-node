'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, TrendingDown, Users, ChevronRight, Download, DollarSign } from 'lucide-react'
import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'
import { MarkovChainCalculator, createSubscriptionMarkovChain } from '@/lib/calculations/markov'

interface CohortData {
  month: string
  cohortSize: number
  retention: number[]
  revenue: number[]
  ltv: number
}

export function CohortAnalysisPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [cohorts, setCohorts] = useState<CohortData[]>([])
  const [viewMode, setViewMode] = useState<'retention' | 'revenue'>('retention')
  const [showPercentage, setShowPercentage] = useState(true)
  
  const nodes = useImprovedFlowStore((state) => state.nodes)
  
  useEffect(() => {
    generateCohortData()
  }, [nodes])
  
  const generateCohortData = () => {
    const regRate = nodes.find(n => n.id === '2')?.data.value || 15
    const joinRate = nodes.find(n => n.id === '3')?.data.value || 76.8
    const rebillRate = nodes.find(n => n.id === '5')?.data.value || 89.2
    const price = nodes.find(n => n.id === '4')?.data.value || 29.90
    const visitors = nodes.find(n => n.id === '1')?.data.value || 10000
    
    const { states, transitions } = createSubscriptionMarkovChain(
      regRate,
      joinRate,
      rebillRate
    )
    
    const calculator = new MarkovChainCalculator(states, transitions)
    
    // Generate cohorts for last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const cohortsData: CohortData[] = []
    
    months.forEach((month, idx) => {
      // Vary cohort size slightly for realism
      const variation = 0.8 + Math.random() * 0.4
      const cohortSize = Math.round((visitors * (regRate / 100) * (joinRate / 100)) * variation)
      
      // Calculate retention for 12 months
      const retention = calculator.calculateCohortRetention(100, 12)
      
      // Calculate revenue for each month
      const revenue = retention.map((ret, monthIdx) => {
        const activeUsers = Math.round(cohortSize * ret)
        return activeUsers * price
      })
      
      // Calculate LTV
      const ltv = calculator.calculateCustomerLifetimeValue(price)
      
      cohortsData.push({
        month,
        cohortSize,
        retention: retention.map(r => r * 100),
        revenue,
        ltv
      })
    })
    
    setCohorts(cohortsData)
  }
  
  const getHeatmapColor = (value: number, mode: 'retention' | 'revenue') => {
    if (mode === 'retention') {
      // Retention: Green (high) to Red (low)
      if (value >= 80) return 'bg-green-500'
      if (value >= 60) return 'bg-green-400'
      if (value >= 40) return 'bg-yellow-400'
      if (value >= 20) return 'bg-orange-400'
      return 'bg-red-400'
    } else {
      // Revenue: Blue gradient
      if (value >= 80) return 'bg-blue-600'
      if (value >= 60) return 'bg-blue-500'
      if (value >= 40) return 'bg-blue-400'
      if (value >= 20) return 'bg-blue-300'
      return 'bg-blue-200'
    }
  }
  
  const formatValue = (value: number, mode: 'retention' | 'revenue') => {
    if (mode === 'retention') {
      return showPercentage ? `${value.toFixed(0)}%` : value.toFixed(1)
    } else {
      return `$${(value / 1000).toFixed(0)}k`
    }
  }

  return (
    <div className={`absolute bottom-4 right-4 bg-white rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm z-10 transition-all duration-300 panel-enter ${
      isExpanded ? 'w-[600px]' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Calendar className="text-blue-500" size={16} />
            Cohort Analysis
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-900 transform transition-all"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Customer retention over time</p>
      </div>

      {/* View Mode Toggle */}
      <div className="p-3 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('retention')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              viewMode === 'retention'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            <Users size={12} className="inline mr-1" />
            Retention
          </button>
          <button
            onClick={() => setViewMode('revenue')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              viewMode === 'revenue'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            <DollarSign size={12} className="inline mr-1" />
            Revenue
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {!isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <div className="text-xs text-gray-500">Avg Retention (M3)</div>
              <div className="text-base font-semibold">
                {(cohorts.reduce((sum, c) => sum + (c.retention[2] || 0), 0) / cohorts.length).toFixed(0)}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <div className="text-xs text-gray-500">Avg LTV</div>
              <div className="text-base font-semibold">
                ${(cohorts.reduce((sum, c) => sum + c.ltv, 0) / cohorts.length).toFixed(0)}
              </div>
            </div>
          </div>
          
          {/* Mini Heatmap Preview */}
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Recent Cohorts</div>
            <div className="space-y-1">
              {cohorts.slice(-3).map((cohort) => (
                <div key={cohort.month} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-8">{cohort.month}</span>
                  <div className="flex gap-0.5 flex-1">
                    {cohort.retention.slice(0, 6).map((ret, i) => (
                      <div
                        key={i}
                        className={`h-4 flex-1 ${getHeatmapColor(ret, 'retention')} opacity-70 rounded-sm`}
                        title={`Month ${i + 1}: ${ret.toFixed(0)}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Cohort Table */}
      {isExpanded && (
        <div className="p-4">
          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={showPercentage}
                  onChange={(e) => setShowPercentage(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Show %
              </label>
            </div>
            <button
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download size={12} />
              Export
            </button>
          </div>

          {/* Cohort Heatmap */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Cohort</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-500">Size</th>
                  {[...Array(12)].map((_, i) => (
                    <th key={i} className="text-center py-2 px-1 font-medium text-gray-500">
                      M{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort) => (
                  <tr key={cohort.month} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 font-medium">{cohort.month}</td>
                    <td className="text-center py-2 px-2 text-gray-500">
                      {cohort.cohortSize.toLocaleString()}
                    </td>
                    {cohort[viewMode].slice(0, 12).map((value, i) => {
                      const normalizedValue = viewMode === 'retention' 
                        ? value 
                        : (value / Math.max(...cohort.revenue)) * 100
                      return (
                        <td key={i} className="text-center py-1 px-1">
                          <div
                            className={`${getHeatmapColor(normalizedValue, viewMode)} text-white rounded px-1 py-0.5 text-[10px] font-medium`}
                            style={{ opacity: Math.max(0.4, normalizedValue / 100) }}
                          >
                            {formatValue(value, viewMode)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insights */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-red-500/10 rounded-lg p-2 border border-red-500/20">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="text-red-500" size={12} />
                <span className="text-xs font-medium">Biggest Drop</span>
              </div>
              <div className="text-xs text-gray-500">
                M1 → M2: -{((100 - cohorts[0]?.retention[1]) || 0).toFixed(0)}%
              </div>
            </div>
            
            <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
              <div className="flex items-center gap-1 mb-1">
                <Users className="text-green-500" size={12} />
                <span className="text-xs font-medium">Best Cohort</span>
              </div>
              <div className="text-xs text-gray-500">
                {cohorts.reduce((best, c) => 
                  c.ltv > best.ltv ? c : best, cohorts[0]
                )?.month || 'N/A'}
              </div>
            </div>
            
            <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="text-blue-500" size={12} />
                <span className="text-xs font-medium">Total LTV</span>
              </div>
              <div className="text-xs text-gray-500">
                ${(cohorts.reduce((sum, c) => sum + (c.cohortSize * c.ltv), 0) / 1000).toFixed(0)}k
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
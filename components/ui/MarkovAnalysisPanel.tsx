'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, Activity, ChevronRight } from 'lucide-react'
import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'
import { MarkovChainCalculator, createSubscriptionMarkovChain } from '@/lib/calculations/markov'

interface PredictionData {
  clv: number
  retention: number
  churn: number
  lifetime: number
  cohortRetention: number[]
}

export function MarkovAnalysisPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [predictions, setPredictions] = useState<PredictionData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState(12) // months
  
  const nodes = useImprovedFlowStore((state) => state.nodes)
  
  useEffect(() => {
    calculatePredictions()
  }, [nodes])
  
  const calculatePredictions = () => {
    // Get values from nodes
    const regRate = nodes.find(n => n.id === '2')?.data.value || 15
    const joinRate = nodes.find(n => n.id === '3')?.data.value || 76.8
    const rebillRate = nodes.find(n => n.id === '5')?.data.value || 89.2
    const price = nodes.find(n => n.id === '4')?.data.value || 29.90
    
    // Create Markov chain
    const { states, transitions } = createSubscriptionMarkovChain(
      regRate,
      joinRate,
      rebillRate
    )
    
    const calculator = new MarkovChainCalculator(states, transitions)
    
    // Calculate CLV and retention metrics
    const analysis = calculator.getComprehensiveAnalysis(price)
    const cohortRetention = calculator.calculateCohortRetention(100, selectedPeriod)
    
    setPredictions({
      clv: analysis.customerLifetimeValue,
      retention: analysis.retentionRate * 100,
      churn: analysis.churnRate * 100,
      lifetime: analysis.averageLifetime,
      cohortRetention
    })
  }
  
  const formatCurrency = (value: number) => {
    if (!isFinite(value)) return '∞'
    return `$${value.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`
  }
  
  const formatPercentage = (value: number) => {
    if (!isFinite(value)) return '∞'
    return `${value.toFixed(1)}%`
  }
  
  const formatMonths = (value: number) => {
    if (!isFinite(value)) return '∞'
    if (value < 1) return `${(value * 30).toFixed(0)} days`
    return `${value.toFixed(1)} months`
  }

  return (
    <div className={`absolute top-4 left-4 bg-white rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm z-10 transition-all duration-300 panel-enter ${
      isExpanded ? 'w-96' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Activity className="text-blue-500" size={16} />
            Predictive Analytics
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-900 transform transition-all"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Markov Chain Predictions</p>
      </div>

      {predictions && (
        <>
          {/* Key Metrics */}
          <div className="p-4 space-y-3">
            {/* Customer Lifetime Value */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-green-600" size={14} />
                  <span className="text-sm font-medium">Customer LTV</span>
                </div>
                <span className="text-base font-semibold text-green-700">
                  {formatCurrency(predictions.clv)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Expected revenue per customer
              </p>
            </div>

            {/* Retention Rate */}
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-blue-600" size={14} />
                  <span className="text-sm font-medium">Retention Rate</span>
                </div>
                <span className="text-base font-semibold text-blue-700">
                  {formatPercentage(predictions.retention)}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Churn: {formatPercentage(predictions.churn)}</span>
                <span>Avg: {formatMonths(predictions.lifetime)}</span>
              </div>
            </div>

            {/* Cohort Analysis Preview */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cohort Retention</span>
                <TrendingUp className="text-purple-600" size={14} />
              </div>
              
              {/* Mini retention chart */}
              <div className="flex items-end gap-0.5 h-12">
                {predictions.cohortRetention.slice(0, 12).map((retention, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-purple-400 opacity-60 rounded-t transition-all hover:opacity-100"
                    style={{ height: `${retention * 100}%` }}
                    title={`Month ${i + 1}: ${formatPercentage(retention * 100)}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>M1</span>
                <span>M6</span>
                <span>M12</span>
              </div>
            </div>
          </div>

          {/* Expanded Analysis */}
          {isExpanded && (
            <div className="p-4 border-t space-y-3">
              {/* Period Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Forecast Period</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(Number(e.target.value))
                    calculatePredictions()
                  }}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                </select>
              </div>

              {/* Detailed Cohort Table */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Monthly Retention</h4>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {predictions.cohortRetention.slice(0, 8).map((retention, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-500">M{i + 1}:</span>
                      <span className="font-medium">{formatPercentage(retention * 100)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Projections */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-3 border border-amber-500/20">
                <h4 className="text-xs font-medium mb-2">Revenue Projections</h4>
                <div className="space-y-2">
                  {[100, 1000, 10000].map(cohortSize => {
                    const totalRevenue = cohortSize * predictions.clv
                    return (
                      <div key={cohortSize} className="flex justify-between text-xs">
                        <span className="text-gray-500">{cohortSize.toLocaleString()} customers:</span>
                        <span className="font-semibold text-orange-700">
                          {formatCurrency(totalRevenue)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Optimization Insights */}
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <h4 className="text-xs font-medium mb-2">Optimization Impact</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500">+5% retention → </span>
                    <span className="font-medium text-blue-700">
                      +{formatCurrency(predictions.clv * 0.2)} CLV
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">-5% churn → </span>
                    <span className="font-medium text-green-700">
                      +{formatMonths(predictions.lifetime * 0.25)} lifetime
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
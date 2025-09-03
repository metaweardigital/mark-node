'use client'

import React, { useState } from 'react'
import { Sliders, Save, RefreshCw, TrendingUp, Target } from 'lucide-react'
import { useImprovedFlowStore } from '@/lib/store/improvedFlowStore'

interface Scenario {
  name: string
  values: {
    visitors: number
    regRate: number
    joinRate: number
    price: number
    rebillRate: number
  }
  expectedRevenue: number
}

const presetScenarios: Scenario[] = [
  {
    name: 'Conservative',
    values: { visitors: 5000, regRate: 10, joinRate: 50, price: 19.90, rebillRate: 70 },
    expectedRevenue: 7465
  },
  {
    name: 'Current',
    values: { visitors: 10000, regRate: 15, joinRate: 76.8, price: 29.90, rebillRate: 89.2 },
    expectedRevenue: 65182
  },
  {
    name: 'Optimistic',
    values: { visitors: 15000, regRate: 20, joinRate: 18, price: 39.90, rebillRate: 92 },
    expectedRevenue: 204678
  },
  {
    name: 'Aggressive',
    values: { visitors: 25000, regRate: 25, joinRate: 22, price: 49.90, rebillRate: 95 },
    expectedRevenue: 561375
  }
]

export function ScenarioPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState('Current')
  
  const nodes = useImprovedFlowStore((state) => state.nodes)
  const updateNodeValue = useImprovedFlowStore((state) => state.updateNodeValue)
  const calculateFlow = useImprovedFlowStore((state) => state.calculateFlow)
  const reset = useImprovedFlowStore((state) => state.reset)

  const applyScenario = (scenario: Scenario) => {
    // Apply all values from the scenario
    updateNodeValue('1', scenario.values.visitors)
    updateNodeValue('2', scenario.values.regRate)
    updateNodeValue('3', scenario.values.joinRate)
    updateNodeValue('4', scenario.values.price)
    updateNodeValue('5', scenario.values.rebillRate)
    
    setSelectedScenario(scenario.name)
    
    // Trigger recalculation
    setTimeout(() => calculateFlow(), 100)
  }

  const getCurrentValues = () => ({
    visitors: nodes.find(n => n.id === '1')?.data.value || 0,
    regRate: nodes.find(n => n.id === '2')?.data.value || 0,
    joinRate: nodes.find(n => n.id === '3')?.data.value || 0,
    price: nodes.find(n => n.id === '4')?.data.value || 0,
    rebillRate: nodes.find(n => n.id === '5')?.data.value || 0,
  })

  const currentRevenue = nodes.find(n => n.id === 'mrr')?.data.value || 0
  const targetRevenue = 1000000 // $1M target

  const progressToTarget = Math.min((currentRevenue / targetRevenue) * 100, 100)

  return (
    <div className={`absolute bottom-4 left-4 bg-white rounded-xl shadow-sm border border-gray-200 backdrop-blur-sm z-10 transition-all duration-300 panel-enter ${
      isExpanded ? 'w-96' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Sliders size={16} className="text-gray-500" />
            Scenario Testing
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        
        {/* Progress to Target */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress to $1M/year</span>
            <span className="font-semibold">{progressToTarget.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToTarget}%` }}
            />
          </div>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="p-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Quick Scenarios</div>
        <div className="grid grid-cols-2 gap-2">
          {presetScenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => applyScenario(scenario)}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                selectedScenario === scenario.name
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <div>{scenario.name}</div>
              <div className="text-[10px] opacity-75 mt-0.5">
                ${scenario.expectedRevenue.toLocaleString()}/mo
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-4 border-t">
          <div className="space-y-3">
            {/* Quick Adjustments */}
            <div className="text-xs font-medium text-gray-500 mb-2">Quick Adjustments</div>
            
            {Object.entries({
              visitors: { label: 'Visitors', id: '1', step: 1000, suffix: '' },
              regRate: { label: 'Registration', id: '2', step: 5, suffix: '%' },
              joinRate: { label: 'Conversion', id: '3', step: 5, suffix: '%' },
              price: { label: 'Price', id: '4', step: 10, suffix: '$' },
              rebillRate: { label: 'Retention', id: '5', step: 5, suffix: '%' },
            }).map(([key, config]) => {
              const currentValue = nodes.find(n => n.id === config.id)?.data.value || 0
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 w-20">{config.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateNodeValue(config.id, Math.max(0, currentValue - config.step))
                      }}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-xs font-semibold transition-colors border border-gray-200"
                    >
                      -
                    </button>
                    <div className="text-sm font-medium w-16 text-center">
                      {config.suffix === '$' ? config.suffix : ''}{currentValue}
                      {config.suffix !== '$' ? config.suffix : ''}
                    </div>
                    <button
                      onClick={() => {
                        updateNodeValue(config.id, currentValue + config.step)
                      }}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-xs font-semibold transition-colors border border-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={reset}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors border border-gray-200"
            >
              <RefreshCw size={12} />
              Reset
            </button>
            <button
              className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Save size={12} />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Target Achievement */}
      <div className="p-4 bg-gray-50 border-t rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-gray-500" size={14} />
            <span className="text-xs text-gray-500">Annual Target</span>
          </div>
          <div className={`text-sm font-semibold ${currentRevenue * 12 >= targetRevenue ? 'text-green-600' : 'text-gray-900'}`}>
            ${(currentRevenue * 12).toLocaleString()} / $1M
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ReactFlowProvider } from 'reactflow'
import { initializeMatomoMappings } from '@/lib/api/matomoInit'
import 'reactflow/dist/style.css'

const FlowContent = dynamic(() => import('./FlowContent').then(mod => mod.FlowContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Loading flow...</div>
    </div>
  )
})

export function FlowCanvas() {
  // Auto-initialize Matomo mappings when component mounts
  useEffect(() => {
    initializeMatomoMappings().catch(err => {
      console.error('[Matomo] Failed to initialize:', err)
    })
  }, [])
  
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  )
}
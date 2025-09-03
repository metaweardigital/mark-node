'use client'

import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'

import { FlowContent } from './FlowContent'

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  )
}
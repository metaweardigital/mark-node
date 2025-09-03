import { create } from 'zustand'
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import { FlowNode, FlowEdge, FlowState } from '@/types/flow.types'
import { MatomoAPIClient } from '@/lib/api/matomoClient'

interface FlowStore extends FlowState {
  setNodes: (nodes: FlowNode[]) => void
  setEdges: (edges: FlowEdge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  updateNodeValue: (nodeId: string, value: number) => void
  setSelectedNode: (nodeId: string | null) => void
  calculateFlow: () => void
  reset: () => void
  loadRealData: (data: any) => void
  fetchMatomoData: (siteId: string | null, network: string | null) => Promise<void>
  matomoClient: MatomoAPIClient | null
}

const initialNodes: FlowNode[] = [
  {
    id: '1',
    type: 'source',
    position: { x: 100, y: 100 },
    data: {
      label: 'Site Visitors',
      value: 10000,
      unit: 'visitors',
      isAdjustable: true,
      min: 0,
      max: 100000,
      step: 100,
      description: 'Total monthly website visitors'
    }
  },
  {
    id: '2',
    type: 'processor',
    position: { x: 350, y: 100 },
    data: {
      label: 'Registration',
      value: 15,
      unit: 'percentage',
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 0.5,
      successRate: 15,
      description: 'Visitor to registration conversion'
    }
  },
  {
    id: '3',
    type: 'processor',
    position: { x: 600, y: 100 },
    data: {
      label: 'Joins',
      value: 76.8,
      unit: 'percentage',
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 0.1,
      successRate: 76.8,
      description: 'Registration to paid conversion'
    }
  },
  {
    id: '4',
    type: 'processor',
    position: { x: 850, y: 100 },
    data: {
      label: 'Price',
      value: 29.90,
      unit: 'currency',
      isAdjustable: true,
      min: 9.90,
      max: 99.90,
      step: 1,
      description: 'Subscription price'
    }
  },
  {
    id: '5',
    type: 'processor',
    position: { x: 600, y: 250 },
    data: {
      label: 'Rebills',
      value: 89.2,
      unit: 'percentage',
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 0.1,
      successRate: 89.2,
      description: 'Monthly retention rate'
    }
  },
  {
    id: '6',
    type: 'outcome',
    position: { x: 1100, y: 100 },
    data: {
      label: 'Revenue',
      value: 0,
      unit: 'currency',
      isAdjustable: false,
      trend: 0,
      description: 'Total monthly revenue'
    }
  },
  {
    id: '7',
    type: 'outcome',
    position: { x: 1100, y: 250 },
    data: {
      label: 'Profit',
      value: 0,
      unit: 'currency',
      isAdjustable: false,
      trend: 0,
      description: 'Monthly profit after expenses'
    }
  }
]

const initialEdges: FlowEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    sourceHandle: 'source',
    target: '2',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 1500,
      conversionRate: 15,
      status: 'optimal'
    }
  },
  {
    id: 'e2-3',
    source: '2',
    sourceHandle: 'source',
    target: '3',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 1152,
      conversionRate: 76.8,
      status: 'optimal'
    }
  },
  {
    id: 'e3-4',
    source: '3',
    sourceHandle: 'source',
    target: '4',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 1152,
      conversionRate: 100,
      status: 'optimal'
    }
  },
  {
    id: 'e4-6',
    source: '4',
    sourceHandle: 'source',
    target: '6',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 34445,
      conversionRate: 100,
      status: 'optimal'
    }
  },
  {
    id: 'e3-5',
    source: '3',
    sourceHandle: 'source',
    target: '5',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 1028,
      conversionRate: 89.2,
      status: 'optimal'
    }
  },
  {
    id: 'e5-6',
    source: '5',
    sourceHandle: 'source',
    target: '6',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 30737,
      conversionRate: 100,
      status: 'optimal'
    }
  },
  {
    id: 'e6-7',
    source: '6',
    sourceHandle: 'source',
    target: '7',
    targetHandle: 'target',
    type: 'animated',
    animated: true,
    data: {
      value: 65182,
      conversionRate: 60,
      status: 'warning'
    }
  }
]

// Initialize Matomo client
const matomoClient = typeof window !== 'undefined' ? new MatomoAPIClient({
  baseUrl: process.env.NEXT_PUBLIC_MATOMO_URL || '',
  authToken: process.env.NEXT_PUBLIC_MATOMO_AUTH_TOKEN || '',
  cacheTimeout: 15
}) : null

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  isCalculating: false,
  matomoClient,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as FlowNode[]
    })
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as FlowEdge[]
    })
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges) as FlowEdge[]
    })
  },

  updateNodeValue: (nodeId, value) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, value } }
          : node
      ),
      isCalculating: true
    }))
    
    // Trigger recalculation after state update
    setTimeout(() => get().calculateFlow(), 0)
  },

  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  calculateFlow: () => {
    const { nodes, edges } = get()
    
    // Get input values
    const visitors = nodes.find(n => n.id === '1')?.data.value || 0
    const regRate = nodes.find(n => n.id === '2')?.data.value || 0
    const joinRate = nodes.find(n => n.id === '3')?.data.value || 0
    const price = nodes.find(n => n.id === '4')?.data.value || 0
    const rebillRate = nodes.find(n => n.id === '5')?.data.value || 0

    // Calculate flow through the pipeline
    const registrations = visitors * (regRate / 100)
    const joins = registrations * (joinRate / 100)
    const initialRevenue = joins * price
    const rebills = joins * (rebillRate / 100)
    const recurringRevenue = rebills * price
    const totalRevenue = initialRevenue + recurringRevenue
    const profit = totalRevenue * 0.6 // 60% profit margin

    // Find the minimum conversion rate (bottleneck)
    const conversionRates = [regRate, joinRate, rebillRate, 60] // 60% for profit margin
    const minConversionRate = Math.min(...conversionRates)

    // Update node values
    const updatedNodes = nodes.map(node => {
      switch (node.id) {
        case '6': // Revenue
          return {
            ...node,
            data: {
              ...node.data,
              value: Math.round(totalRevenue),
              trend: node.data.value ? ((totalRevenue - node.data.value) / node.data.value) * 100 : 0
            }
          }
        case '7': // Profit
          return {
            ...node,
            data: {
              ...node.data,
              value: Math.round(profit),
              trend: node.data.value ? ((profit - node.data.value) / node.data.value) * 100 : 0
            }
          }
        default:
          return node
      }
    })

    // Update edge data with flow values and dynamic status
    const updatedEdges = edges.map(edge => {
      let flowValue = 0
      let conversionRate = edge.data?.conversionRate || 0

      // Calculate actual flow values for each edge
      switch (edge.id) {
        case 'e1-2':
          flowValue = registrations
          conversionRate = regRate
          break
        case 'e2-3':
          flowValue = joins
          conversionRate = joinRate
          break
        case 'e3-4':
          flowValue = joins
          break
        case 'e4-6':
          flowValue = initialRevenue
          break
        case 'e3-5':
          flowValue = rebills
          conversionRate = rebillRate
          break
        case 'e5-6':
          flowValue = recurringRevenue
          break
        case 'e6-7':
          flowValue = profit
          conversionRate = 60
          break
      }

      // Determine status based on performance relative to average
      let status: 'optimal' | 'warning' | 'critical' = 'optimal'
      
      // If this is the bottleneck, mark as critical
      if (conversionRate === minConversionRate && conversionRate < 50) {
        status = 'critical'
      } else if (conversionRate < 30) {
        status = 'critical'
      } else if (conversionRate < 60) {
        status = 'warning'
      } else {
        status = 'optimal'
      }
      
      return {
        ...edge,
        data: {
          ...edge.data,
          value: Math.round(flowValue),
          conversionRate,
          status
        }
      }
    })

    set({
      nodes: updatedNodes,
      edges: updatedEdges,
      isCalculating: false
    })
  },

  reset: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNode: null,
      isCalculating: false
    })
  },

  loadRealData: (data: any) => {
    // Process the pasted data and update nodes
    const { updateNodeValue, calculateFlow } = get()
    
    // Extract metrics from the data
    // Supporting multiple formats: CSV, JSON, or structured text
    
    // If data contains website metrics
    if (data.visitors || data.uniqueVisitors || data.users) {
      const visitors = data.visitors || data.uniqueVisitors || data.users || 0
      updateNodeValue('1', visitors)
    }
    
    // Registration/signup rate
    if (data.registrationRate || data.signupRate || data.conversionRate) {
      const regRate = data.registrationRate || data.signupRate || data.conversionRate || 0
      updateNodeValue('2', regRate)
    } else if (data.signups && data.visitors) {
      // Calculate rate from raw numbers
      const regRate = (data.signups / data.visitors) * 100
      updateNodeValue('2', regRate)
    }
    
    // Join/purchase rate
    if (data.joinRate || data.purchaseRate || data.trialToPayRate) {
      const joinRate = data.joinRate || data.purchaseRate || data.trialToPayRate || 0
      updateNodeValue('3', joinRate)
    } else if (data.purchases && data.signups) {
      // Calculate rate from raw numbers
      const joinRate = (data.purchases / data.signups) * 100
      updateNodeValue('3', joinRate)
    }
    
    // Average price
    if (data.price || data.averageOrderValue || data.aov) {
      const price = data.price || data.averageOrderValue || data.aov || 0
      updateNodeValue('4', price)
    }
    
    // Rebill/retention rate
    if (data.rebillRate || data.retentionRate || data.recurringRate) {
      const rebillRate = data.rebillRate || data.retentionRate || data.recurringRate || 0
      updateNodeValue('5', rebillRate)
    }
    
    // If raw transaction data is provided
    if (data.transactions || data.charges) {
      const transactions = data.transactions || data.charges || []
      if (Array.isArray(transactions) && transactions.length > 0) {
        // Calculate average price from transactions
        const avgPrice = transactions.reduce((sum: number, t: any) => 
          sum + (t.amount || t.price || 0), 0) / transactions.length
        updateNodeValue('4', avgPrice)
      }
    }
    
    // Trigger recalculation
    setTimeout(() => calculateFlow(), 100)
    
    console.log('Data loaded successfully:', data)
  },

  fetchMatomoData: async (siteId: string | null, network: string | null) => {
    const { matomoClient, updateNodeValue, calculateFlow } = get()
    
    if (!matomoClient) {
      console.error('Matomo client not initialized')
      return
    }

    try {
      let visitors = 0
      
      if (!siteId && !network) {
        // Fetch all sites
        const allSites = [
          16, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 46, 47, 48, 49, 50, 51, // CzechAV
          82, 83, 84, 85, 86, 87, 88, 56, // CzechGAV
          57, 59, 60, 55, 54, 62, 65, 58, 63, // GoPerv
          77, 78, 79, 80, 81, // XXL
          73, 69, 70, 76, 66, 74, 72, 71, 68, 67, 75 // NUDZ
        ]
        
        // Use bulk API for all sites
        const promises = allSites.map(id => 
          matomoClient.fetchMetrics(id, 'month', 'today')
        )
        const results = await Promise.all(promises)
        
        visitors = results.reduce((sum, data) => 
          sum + (data?.nb_uniq_visitors || 0), 0
        )
      } else if (network) {
        // Fetch network sites
        let networkSites: number[] = []
        
        switch (network.toLowerCase()) {
          case 'czechav':
          case 'czechcash':
            networkSites = [16, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 46, 47, 48, 49, 50, 51]
            break
          case 'czechgav':
            networkSites = [82, 83, 84, 85, 86, 87, 88, 56]
            break
          case 'goperv':
            networkSites = [57, 59, 60, 55, 54, 62, 65, 58, 63]
            break
          case 'xxl':
            networkSites = [77, 78, 79, 80, 81]
            break
          case 'nudz':
            networkSites = [73, 69, 70, 76, 66, 74, 72, 71, 68, 67, 75]
            break
        }
        
        if (networkSites.length > 0) {
          const promises = networkSites.map(id => 
            matomoClient.fetchMetrics(id, 'month', 'today')
          )
          const results = await Promise.all(promises)
          
          visitors = results.reduce((sum, data) => 
            sum + (data?.nb_uniq_visitors || 0), 0
          )
        }
      } else if (siteId) {
        // Fetch single site
        const siteIdNum = matomoClient.getSiteIdByName(siteId)
        if (siteIdNum) {
          const data = await matomoClient.fetchMetrics(siteIdNum, 'month', 'today')
          visitors = data?.nb_uniq_visitors || 0
        }
      }
      
      // Update visitor node with real data
      if (visitors > 0) {
        updateNodeValue('1', visitors)
        console.log(`Updated visitors from Matomo: ${visitors.toLocaleString()}`)
        
        // Trigger flow recalculation
        setTimeout(() => calculateFlow(), 100)
      }
    } catch (error) {
      console.error('Failed to fetch Matomo data:', error)
    }
  }
}))
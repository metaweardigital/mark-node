import { create } from 'zustand'
import { 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow'
import { calculateMRR, calculateWeightedAveragePrice, PRODUCT_DISTRIBUTION } from '@/lib/config/pricing'
import { calculateWeightedPrice, PRODUCT_STATS, ProductFilter, NETWORKS, SITES } from '@/lib/config/realPricing'

type FlowNode = Node
type FlowEdge = Edge

interface FlowStore {
  nodes: FlowNode[]
  edges: FlowEdge[]
  selectedNode: string | null
  isCalculating: boolean
  productFilter: ProductFilter
  subFilter: string
  
  setNodes: (nodes: FlowNode[]) => void
  setEdges: (edges: FlowEdge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  updateNodeValue: (nodeId: string, value: number) => void
  updateNodeFilter: (nodeId: string, mainFilter: ProductFilter, subFilter?: string) => void
  setSelectedNode: (nodeId: string | null) => void
  calculateFlow: () => void
  reset: () => void
  loadRealData: (data: any) => void
}

const initialNodes: FlowNode[] = [
  // Main Flow
  {
    id: '1',
    type: 'source',
    position: { x: 100, y: 300 },
    data: { 
      label: 'Monthly Visitors', 
      value: 10000,
      unit: 'visitors',
      isAdjustable: true,
      min: 100,
      max: 100000,
      step: 100
    }
  },
  {
    id: '2',
    type: 'processor',
    position: { x: 350, y: 300 },
    data: { 
      label: 'Registration Rate', 
      value: 15,
      unit: 'percentage',
      isAdjustable: true,
      min: 0.1,
      max: 100,
      step: 0.1,
      successRate: 15
    }
  },
  {
    id: '3',
    type: 'processor',
    position: { x: 600, y: 300 },
    data: { 
      label: 'Purchase Rate', 
      value: 12,
      unit: 'percentage',
      isAdjustable: true,
      min: 0.1,
      max: 100,
      step: 0.1,
      successRate: 12
    }
  },
  
  // Enhanced Product Filter Node
  {
    id: 'filter',
    type: 'enhancedProductFilter',
    position: { x: 850, y: 50 },
    data: {
      label: 'Product Filter',
      mainFilter: 'all' as ProductFilter,
      subFilter: 'all',
      stats: {
        networks: PRODUCT_STATS.totalNetworks,
        sites: PRODUCT_STATS.activeSites,
        avgPrice: 0
      }
    }
  },
  
  // Product Type Split
  {
    id: 'split',
    type: 'processor',
    position: { x: 850, y: 300 },
    data: { 
      label: 'Product Selection', 
      value: 180, // Will be calculated
      unit: 'users',
      isAdjustable: false,
      description: 'Users choosing products'
    }
  },
  
  // Single Site Branch
  {
    id: 'single',
    type: 'processor',
    position: { x: 1100, y: 200 },
    data: { 
      label: 'Individual Sites', 
      value: 65, // 65% choose single
      unit: 'percentage',
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      successRate: 65,
      description: 'Single site purchases'
    }
  },
  
  // Bundle Branch  
  {
    id: 'bundle',
    type: 'processor',
    position: { x: 1100, y: 400 },
    data: { 
      label: 'Network Bundles', 
      value: 35, // 35% choose bundle
      unit: 'percentage',
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      successRate: 35,
      description: 'Network bundle purchases'
    }
  },
  
  // Subscription Period Nodes for Single
  {
    id: 'single_1m',
    type: 'processor',
    position: { x: 1400, y: 100 },
    data: { 
      label: '1 Month', 
      value: 40,
      unit: 'percentage',
      price: 29.90,
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      description: 'Monthly subscription'
    }
  },
  {
    id: 'single_3m',
    type: 'processor',
    position: { x: 1400, y: 200 },
    data: { 
      label: '3 Months', 
      value: 35,
      unit: 'percentage',
      price: 64.90,
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      description: '3-month subscription'
    }
  },
  {
    id: 'single_6m',
    type: 'processor',
    position: { x: 1400, y: 300 },
    data: { 
      label: '6 Months', 
      value: 25,
      unit: 'percentage',
      price: 99.90,
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      description: '6-month subscription'
    }
  },
  
  // Subscription Period Nodes for Bundle
  {
    id: 'bundle_1m',
    type: 'processor',
    position: { x: 1400, y: 400 },
    data: { 
      label: '1 Month', 
      value: 40,
      unit: 'percentage',
      price: 39.90,
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      description: '€39.90/mo'
    }
  },
  {
    id: 'bundle_3m',
    type: 'processor',
    position: { x: 1400, y: 500 },
    data: { 
      label: '3 Months', 
      value: 35,
      unit: 'percentage',
      price: 26.63,
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      description: '€26.63/mo'
    }
  },
  {
    id: 'bundle_6m',
    type: 'processor',
    position: { x: 1400, y: 600 },
    data: { 
      label: '6 Months', 
      value: 25,
      unit: 'percentage',
      price: 21.65,
      isAdjustable: true,
      min: 0,
      max: 100,
      step: 1,
      description: '€21.65/mo'
    }
  },
  
  // Revenue Aggregation
  {
    id: 'mrr',
    type: 'outcome',
    position: { x: 1700, y: 350 },
    data: { 
      label: 'Monthly Recurring Revenue', 
      value: 0,
      unit: 'currency',
      isAdjustable: false
    }
  },
  {
    id: 'arr',
    type: 'outcome',
    position: { x: 1950, y: 350 },
    data: { 
      label: 'Annual Revenue', 
      value: 0,
      unit: 'currency',
      isAdjustable: false
    }
  }
]

const initialEdges: FlowEdge[] = [
  // Main flow
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'animated',
    animated: true,
    data: { value: 10000, conversionRate: 100, status: 'optimal' }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'animated',
    animated: true,
    data: { value: 1500, conversionRate: 15, status: 'warning' }
  },
  {
    id: 'e3-split',
    source: '3',
    target: 'split',
    type: 'animated',
    animated: true,
    data: { value: 180, conversionRate: 12, status: 'warning' }
  },
  {
    id: 'efilter-info',
    source: 'filter',
    target: 'split',
    type: 'animated',
    animated: false,
    style: { stroke: '#9333ea', strokeWidth: 2, strokeDasharray: '5 5' },
    data: { value: 0, conversionRate: 100, status: 'optimal' }
  },
  
  // Product split
  {
    id: 'esplit-single',
    source: 'split',
    target: 'single',
    type: 'animated',
    animated: true,
    data: { value: 975, conversionRate: 65, status: 'optimal' }
  },
  {
    id: 'esplit-bundle',
    source: 'split',
    target: 'bundle',
    type: 'animated',
    animated: true,
    data: { value: 525, conversionRate: 35, status: 'warning' }
  },
  
  // Single site subscription periods
  {
    id: 'esingle-1m',
    source: 'single',
    target: 'single_1m',
    type: 'animated',
    animated: true,
    data: { value: 390, conversionRate: 40, status: 'warning' }
  },
  {
    id: 'esingle-3m',
    source: 'single',
    target: 'single_3m',
    type: 'animated',
    animated: true,
    data: { value: 341, conversionRate: 35, status: 'warning' }
  },
  {
    id: 'esingle-6m',
    source: 'single',
    target: 'single_6m',
    type: 'animated',
    animated: true,
    data: { value: 244, conversionRate: 25, status: 'critical' }
  },
  
  // Bundle subscription periods
  {
    id: 'ebundle-1m',
    source: 'bundle',
    target: 'bundle_1m',
    type: 'animated',
    animated: true,
    data: { value: 210, conversionRate: 40, status: 'warning' }
  },
  {
    id: 'ebundle-3m',
    source: 'bundle',
    target: 'bundle_3m',
    type: 'animated',
    animated: true,
    data: { value: 184, conversionRate: 35, status: 'warning' }
  },
  {
    id: 'ebundle-6m',
    source: 'bundle',
    target: 'bundle_6m',
    type: 'animated',
    animated: true,
    data: { value: 131, conversionRate: 25, status: 'critical' }
  },
  
  // All subscription types to MRR
  {
    id: 'esingle1m-mrr',
    source: 'single_1m',
    target: 'mrr',
    type: 'animated',
    animated: false
  },
  {
    id: 'esingle3m-mrr',
    source: 'single_3m',
    target: 'mrr',
    type: 'animated',
    animated: false
  },
  {
    id: 'esingle6m-mrr',
    source: 'single_6m',
    target: 'mrr',
    type: 'animated',
    animated: false
  },
  {
    id: 'ebundle1m-mrr',
    source: 'bundle_1m',
    target: 'mrr',
    type: 'animated',
    animated: false
  },
  {
    id: 'ebundle3m-mrr',
    source: 'bundle_3m',
    target: 'mrr',
    type: 'animated',
    animated: false
  },
  {
    id: 'ebundle6m-mrr',
    source: 'bundle_6m',
    target: 'mrr',
    type: 'animated',
    animated: false
  },
  
  // MRR to ARR
  {
    id: 'emrr-arr',
    source: 'mrr',
    target: 'arr',
    type: 'animated',
    animated: true,
    data: { value: 0, conversionRate: 100, status: 'optimal' }
  }
]

export const useImprovedFlowStore = create<FlowStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  isCalculating: false,
  productFilter: 'all' as ProductFilter,
  subFilter: 'all',

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
    
    setTimeout(() => get().calculateFlow(), 0)
  },

  updateNodeFilter: (nodeId: string, mainFilter: ProductFilter, subFilter: string = 'all') => {
    const { nodes, calculateFlow } = get()
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, mainFilter, subFilter } }
        : node
    )
    set({ nodes: updatedNodes, productFilter: mainFilter, subFilter })
    setTimeout(() => calculateFlow(), 100)
  },

  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  calculateFlow: () => {
    const { nodes, edges } = get()
    
    // Get input values
    const visitors = nodes.find(n => n.id === '1')?.data.value || 0
    const regRate = nodes.find(n => n.id === '2')?.data.value || 0
    const purchaseRate = nodes.find(n => n.id === '3')?.data.value || 0
    
    // Calculate signups and purchases
    const signups = visitors * (regRate / 100)
    const purchases = signups * (purchaseRate / 100)
    
    // Get filter node and current filter FIRST
    const filterNode = nodes.find(n => n.id === 'filter')
    const currentFilter = filterNode?.data.mainFilter || get().productFilter || 'all'
    const currentSubFilter = filterNode?.data.subFilter || get().subFilter || 'all'
    
    // Get product distribution percentages
    const singlePct = nodes.find(n => n.id === 'single')?.data.value || 65
    const bundlePct = nodes.find(n => n.id === 'bundle')?.data.value || 35
    
    // Calculate product selections based on filter
    let singleUsers, bundleUsers
    
    if (currentFilter === 'networks') {
      // All users go to networks
      singleUsers = purchases
      bundleUsers = 0
    } else if (currentFilter === 'sites') {
      // All users go to individual sites
      singleUsers = purchases
      bundleUsers = 0
    } else {
      // Normal distribution
      singleUsers = purchases * (singlePct / 100)
      bundleUsers = purchases * (bundlePct / 100)
    }
    
    // Get subscription period distributions
    const single1mPct = nodes.find(n => n.id === 'single_1m')?.data.value || 40
    const single3mPct = nodes.find(n => n.id === 'single_3m')?.data.value || 35
    const single6mPct = nodes.find(n => n.id === 'single_6m')?.data.value || 25
    
    const bundle1mPct = nodes.find(n => n.id === 'bundle_1m')?.data.value || 40
    const bundle3mPct = nodes.find(n => n.id === 'bundle_3m')?.data.value || 35
    const bundle6mPct = nodes.find(n => n.id === 'bundle_6m')?.data.value || 25
    
    // Calculate users in each subscription type
    const single1mUsers = singleUsers * (single1mPct / 100)
    const single3mUsers = singleUsers * (single3mPct / 100)
    const single6mUsers = singleUsers * (single6mPct / 100)
    
    const bundle1mUsers = bundleUsers * (bundle1mPct / 100)
    const bundle3mUsers = bundleUsers * (bundle3mPct / 100)
    const bundle6mUsers = bundleUsers * (bundle6mPct / 100)
    
    // Get prices based on filter
    let single1mPrice: number = 29.90
    let single3mPrice: number = 64.90
    let single6mPrice: number = 99.90
    let bundle1mPrice: number = 39.90
    let bundle3mPrice: number = 79.90
    let bundle6mPrice: number = 129.90
    
    if (currentFilter === 'networks') {
      if (currentSubFilter !== 'all') {
        // Specific network selected
        const network = NETWORKS.find(n => n.id === currentSubFilter)
        if (network) {
          single1mPrice = network.pricing['1_month']
          single3mPrice = network.pricing['3_months']
          single6mPrice = network.pricing['6_months']
        } else {
          // Fallback to defaults
          single1mPrice = calculateWeightedPrice('networks', '1_month')
          single3mPrice = calculateWeightedPrice('networks', '3_months')
          single6mPrice = calculateWeightedPrice('networks', '6_months')
        }
      } else {
        // All networks
        single1mPrice = calculateWeightedPrice('networks', '1_month')
        single3mPrice = calculateWeightedPrice('networks', '3_months')
        single6mPrice = calculateWeightedPrice('networks', '6_months')
      }
      bundle1mPrice = 0 // No bundles in network-only mode
      bundle3mPrice = 0
      bundle6mPrice = 0
    } else if (currentFilter === 'sites') {
      if (currentSubFilter !== 'all') {
        // Specific site selected
        const site = SITES.find(s => s.id === currentSubFilter)
        if (site) {
          single1mPrice = site.pricing['1_month']
          single3mPrice = site.pricing['3_months']
          single6mPrice = site.pricing['6_months']
          
          // Find the network bundle for this site for upsell
          if (site.network !== 'None') {
            const network = NETWORKS.find(n => n.name === site.network)
            if (network) {
              bundle1mPrice = network.pricing['1_month']
              bundle3mPrice = network.pricing['3_months']
              bundle6mPrice = network.pricing['6_months']
              // Enable bundle path for upsell (20% of individual site buyers upgrade)
              bundleUsers = singleUsers * 0.2
              singleUsers = singleUsers * 0.8
            } else {
              bundle1mPrice = 0
              bundle3mPrice = 0
              bundle6mPrice = 0
            }
          } else {
            bundle1mPrice = 0
            bundle3mPrice = 0
            bundle6mPrice = 0
          }
        } else {
          // Fallback to defaults
          single1mPrice = calculateWeightedPrice('sites', '1_month')
          single3mPrice = calculateWeightedPrice('sites', '3_months')
          single6mPrice = calculateWeightedPrice('sites', '6_months')
          bundle1mPrice = 0
          bundle3mPrice = 0
          bundle6mPrice = 0
        }
      } else {
        // All sites - show average network bundle prices for upsell
        single1mPrice = calculateWeightedPrice('sites', '1_month')
        single3mPrice = calculateWeightedPrice('sites', '3_months')
        single6mPrice = calculateWeightedPrice('sites', '6_months')
        bundle1mPrice = calculateWeightedPrice('networks', '1_month')
        bundle3mPrice = calculateWeightedPrice('networks', '3_months')
        bundle6mPrice = calculateWeightedPrice('networks', '6_months')
        // Enable bundle path for upsell (15% of all site buyers upgrade)
        bundleUsers = singleUsers * 0.15
        singleUsers = singleUsers * 0.85
      }
    } else {
      // All products mode
      single1mPrice = calculateWeightedPrice('sites', '1_month')
      single3mPrice = calculateWeightedPrice('sites', '3_months')
      single6mPrice = calculateWeightedPrice('sites', '6_months')
      bundle1mPrice = calculateWeightedPrice('networks', '1_month')
      bundle3mPrice = calculateWeightedPrice('networks', '3_months')
      bundle6mPrice = calculateWeightedPrice('networks', '6_months')
    }
    
    // Calculate MRR (need to convert 3-month and 6-month prices to monthly)
    const singleMRR = (single1mUsers * single1mPrice * 0.85) + // 85% retention for monthly
                      (single3mUsers * (single3mPrice / 3) * 0.92) + // 92% retention for 3 months
                      (single6mUsers * (single6mPrice / 6) * 0.95)   // 95% retention for 6 months
    
    const bundleMRR = (bundle1mUsers * bundle1mPrice * 0.85) +
                      (bundle3mUsers * (bundle3mPrice / 3) * 0.92) +
                      (bundle6mUsers * (bundle6mPrice / 6) * 0.95)
    
    const totalMRR = singleMRR + bundleMRR
    const annualRevenue = totalMRR * 12
    
    // Update nodes with calculated values
    const updatedNodes = nodes.map(node => {
      switch (node.id) {
        case 'filter':
          let statsNetworks = 0
          let statsSites = 0
          
          if (currentFilter === 'all') {
            statsNetworks = PRODUCT_STATS.totalNetworks
            statsSites = PRODUCT_STATS.activeSites
          } else if (currentFilter === 'networks') {
            if (currentSubFilter === 'all') {
              statsNetworks = PRODUCT_STATS.totalNetworks
            } else {
              statsNetworks = 1 // Specific network
            }
          } else if (currentFilter === 'sites') {
            if (currentSubFilter === 'all') {
              statsSites = PRODUCT_STATS.activeSites
            } else {
              statsSites = 1 // Specific site
            }
          }
          
          return { 
            ...node, 
            data: { 
              ...node.data, 
              stats: {
                networks: statsNetworks,
                sites: statsSites,
                avgPrice: single1mPrice || 0
              }
            } 
          }
        case 'split':
          return { ...node, data: { ...node.data, value: Math.round(purchases) }}
        case 'single':
          if (currentFilter === 'networks') {
            let networkLabel = ''
            let networkDesc = ''
            if (currentSubFilter === 'all') {
              networkLabel = `All Networks (${PRODUCT_STATS.totalNetworks})`
              networkDesc = NETWORKS.map(n => n.name).join(', ')
            } else {
              const network = NETWORKS.find(n => n.id === currentSubFilter)
              networkLabel = network?.name || 'Network'
              networkDesc = `${network?.sites.length || 0} sites included`
            }
            return { 
              ...node, 
              data: { 
                ...node.data, 
                label: networkLabel,
                description: networkDesc,
                value: 100 // All go to networks when filtered
              } 
            }
          } else if (currentFilter === 'sites') {
            let siteLabel = ''
            let siteDesc = ''
            if (currentSubFilter === 'all') {
              siteLabel = `All Sites (${PRODUCT_STATS.activeSites})`
              siteDesc = 'Individual site subscriptions'
            } else {
              const site = SITES.find(s => s.id === currentSubFilter)
              siteLabel = site?.id || 'Site'
              siteDesc = `Network: ${site?.network || 'Unknown'}`
            }
            return { 
              ...node, 
              data: { 
                ...node.data, 
                label: siteLabel,
                description: siteDesc,
                value: 100 // All go to sites when filtered
              } 
            }
          } else {
            // Mixed mode - normal distribution
            return { 
              ...node, 
              data: { 
                ...node.data, 
                label: `Individual Sites (${PRODUCT_STATS.activeSites})`,
                description: 'Single site purchases',
                value: singlePct
              } 
            }
          }
        case 'bundle':
          if (currentFilter === 'networks') {
            // Hide bundle node when showing networks only
            return { 
              ...node, 
              data: { 
                ...node.data, 
                label: 'N/A',
                description: 'Networks only mode',
                value: 0,
                hidden: true
              } 
            }
          } else if (currentFilter === 'sites') {
            // Show upsell opportunity for site-to-network upgrade
            if (currentSubFilter !== 'all') {
              const site = SITES.find(s => s.id === currentSubFilter)
              if (site && site.network !== 'None') {
                const network = NETWORKS.find(n => n.name === site.network)
                return { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    label: `Upgrade to ${site.network}`,
                    description: `${network?.sites.length || 0} sites bundle`,
                    value: 20, // 20% upgrade rate
                    hidden: false
                  } 
                }
              } else {
                return { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    label: 'N/A',
                    description: 'No bundle available',
                    value: 0,
                    hidden: true
                  } 
                }
              }
            } else {
              // All sites - show general network upsell
              return { 
                ...node, 
                data: { 
                  ...node.data, 
                  label: `Network Upgrades`,
                  description: 'Upsell to network bundles',
                  value: 15, // 15% upgrade rate for all sites
                  hidden: false
                } 
              }
            }
          } else {
            // Mixed mode - show bundles
            return { 
              ...node, 
              data: { 
                ...node.data, 
                label: `Network Bundles (${PRODUCT_STATS.totalNetworks})`,
                description: 'Upsell to network bundles',
                value: bundlePct,
                hidden: false
              } 
            }
          }
        case 'single_1m':
          return { 
            ...node, 
            data: { 
              ...node.data,
              description: `€${single1mPrice.toFixed(2)}`
            }
          }
        case 'single_3m':
          return { 
            ...node, 
            data: { 
              ...node.data,
              description: `€${single3mPrice.toFixed(2)}`
            }
          }
        case 'single_6m':
          return { 
            ...node, 
            data: { 
              ...node.data,
              description: `€${single6mPrice.toFixed(2)}`
            }
          }
        case 'bundle_1m':
          const shouldHide1m = currentFilter === 'networks' || 
            (currentFilter === 'sites' && currentSubFilter !== 'all' && 
             (!SITES.find(s => s.id === currentSubFilter) || 
              SITES.find(s => s.id === currentSubFilter)?.network === 'None'))
          return { 
            ...node, 
            data: { 
              ...node.data,
              hidden: shouldHide1m,
              description: `€${bundle1mPrice.toFixed(2)}`
            }
          }
        case 'bundle_3m':
          const shouldHide3m = currentFilter === 'networks' || 
            (currentFilter === 'sites' && currentSubFilter !== 'all' && 
             (!SITES.find(s => s.id === currentSubFilter) || 
              SITES.find(s => s.id === currentSubFilter)?.network === 'None'))
          return { 
            ...node, 
            data: { 
              ...node.data,
              hidden: shouldHide3m,
              description: `€${bundle3mPrice.toFixed(2)}`
            }
          }
        case 'bundle_6m':
          const shouldHide6m = currentFilter === 'networks' || 
            (currentFilter === 'sites' && currentSubFilter !== 'all' && 
             (!SITES.find(s => s.id === currentSubFilter) || 
              SITES.find(s => s.id === currentSubFilter)?.network === 'None'))
          return { 
            ...node, 
            data: { 
              ...node.data,
              hidden: shouldHide6m,
              description: `€${bundle6mPrice.toFixed(2)}`
            }
          }
        case 'mrr':
          return { ...node, data: { ...node.data, value: Math.round(totalMRR) }}
        case 'arr':
          return { ...node, data: { ...node.data, value: Math.round(annualRevenue) }}
        default:
          return node
      }
    })
    
    // Update edge flow values
    const updatedEdges = edges.map(edge => {
      let flowValue = 0
      let status: 'optimal' | 'warning' | 'critical' = 'optimal'
      
      switch (edge.id) {
        case 'e1-2':
          flowValue = visitors
          break
        case 'e2-3':
          flowValue = signups
          status = regRate < 20 ? 'critical' : regRate < 30 ? 'warning' : 'optimal'
          break
        case 'e3-split':
          flowValue = purchases
          status = purchaseRate < 10 ? 'critical' : purchaseRate < 20 ? 'warning' : 'optimal'
          break
        case 'esplit-single':
          flowValue = singleUsers
          break
        case 'esplit-bundle':
          flowValue = bundleUsers
          break
        case 'esingle-1m':
          flowValue = single1mUsers
          break
        case 'esingle-3m':
          flowValue = single3mUsers
          break
        case 'esingle-6m':
          flowValue = single6mUsers
          break
        case 'ebundle-1m':
          flowValue = bundle1mUsers
          break
        case 'ebundle-3m':
          flowValue = bundle3mUsers
          break
        case 'ebundle-6m':
          flowValue = bundle6mUsers
          break
        case 'esingle1m-mrr':
          flowValue = single1mUsers * single1mPrice
          break
        case 'esingle3m-mrr':
          flowValue = single3mUsers * single3mPrice
          break
        case 'esingle6m-mrr':
          flowValue = single6mUsers * single6mPrice
          break
        case 'ebundle1m-mrr':
          flowValue = bundle1mUsers * bundle1mPrice
          break
        case 'ebundle3m-mrr':
          flowValue = bundle3mUsers * bundle3mPrice
          break
        case 'ebundle6m-mrr':
          flowValue = bundle6mUsers * bundle6mPrice
          break
        case 'emrr-arr':
          flowValue = annualRevenue
          break
      }
      
      return {
        ...edge,
        data: {
          ...edge.data,
          value: Math.round(flowValue),
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
    const { updateNodeValue, calculateFlow } = get()
    
    // Load visitor and conversion data
    if (data.visitors) updateNodeValue('1', data.visitors)
    if (data.registrationRate) updateNodeValue('2', data.registrationRate)
    if (data.purchaseRate) updateNodeValue('3', data.purchaseRate)
    
    // Load product distribution if available
    if (data.singlePercentage) updateNodeValue('single', data.singlePercentage)
    if (data.bundlePercentage) updateNodeValue('bundle', data.bundlePercentage)
    
    // Load subscription period distribution if available
    if (data.single1m) updateNodeValue('single_1m', data.single1m)
    if (data.single3m) updateNodeValue('single_3m', data.single3m)
    if (data.single6m) updateNodeValue('single_6m', data.single6m)
    if (data.bundle1m) updateNodeValue('bundle_1m', data.bundle1m)
    if (data.bundle3m) updateNodeValue('bundle_3m', data.bundle3m)
    if (data.bundle6m) updateNodeValue('bundle_6m', data.bundle6m)
    
    setTimeout(() => calculateFlow(), 100)
    console.log('Real data loaded:', data)
  }
}))
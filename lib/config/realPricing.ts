// Real pricing configuration from CSV data

export interface Site {
  id: string
  url: string
  network: string
  type: 'site' | 'network'
  status: 'Active' | 'Waiting'
  category: 'Straight' | 'Gay'
  pricing: {
    '1_month': number
    '3_months': number
    '6_months': number
  }
}

export interface Network {
  id: string
  name: string
  url: string
  sites: string[]
  pricing: {
    '1_month': number
    '3_months': number
    '6_months': number
  }
  category: 'Straight' | 'Gay'
  status: 'Active' | 'Waiting'
}

// Networks with their bundle pricing
export const NETWORKS: Network[] = [
  {
    id: 'czechav',
    name: 'CzechAV',
    url: 'czechav.com',
    category: 'Straight',
    status: 'Active',
    sites: [
      'czechamateurs.com', 'czechbangbus.com', 'czechbitch.com', 'czechcabins.com',
      'czechcouples.com', 'czechestrogenolit.com', 'czechexperiment.com', 'czechfantasy.com',
      'czechfirstvideo.com', 'czechgangbang.com', 'czechgardenparty.com', 'czechharem.com',
      'czechhomeorgy.com', 'czechmassage.com', 'czechmegaswingers.com', 'czechorgasm.com',
      'czechparties.com', 'czechpawnshop.com', 'czechpool.com', 'czechsauna.com',
      'czechsnooper.com', 'czechsolarium.com', 'czechspy.com', 'czechstreets.com',
      'czechsupermodels.com', 'czechtantra.com', 'czechtaxi.com', 'czechlesbians.com',
      'czechwifeswap.com', 'czechstudents.com', 'czechjacker.com', 'czechdellais.com'
    ],
    pricing: {
      '1_month': 39.90,
      '3_months': 79.90,
      '6_months': 129.90
    }
  },
  {
    id: 'czechgav',
    name: 'CzechGAV',
    url: 'czechgav.com',
    category: 'Gay',
    status: 'Active',
    sites: [
      'czechgayamateurs.com', 'czechgaycasting.com', 'czechgaycouples.com',
      'czechgayfantasy.com', 'czechgaymassage.com', 'czechgaysolarium.com',
      'gayhorrorporn.com', 'gayxvirtual.com'
    ],
    pricing: {
      '1_month': 29.90,
      '3_months': 64.90,
      '6_months': 99.90
    }
  },
  {
    id: 'goperv',
    name: 'GoPerv',
    url: 'goperv.com',
    category: 'Straight',
    status: 'Waiting',
    sites: [
      'perversefamily.com', 'perversefamilylive.com', 'extremestreets.com',
      'dirtysarah.com', 'powerfetish.com', 'xvirtual.com', 'horrorporn.com',
      'r51.com', 'clubbdsm.com', 'selfiefetish.com'
    ],
    pricing: {
      '1_month': 59.90,
      '3_months': 129.90,
      '6_months': 179.90
    }
  },
  {
    id: 'xxl',
    name: 'XXL',
    url: 'xxlgang.com',
    category: 'Straight',
    status: 'Waiting',
    sites: [
      'redneckjohn.com', 'mikebigdick.com', 'monstercockgang.com',
      'annalovesshemale.com', 'unusualpeople.com', 'xxlpiss.com',
      'xxldeepthroat.com', 'xxlanal.com', 'xxlbukkake.com', 'xxlfootfetish.com'
    ],
    pricing: {
      '1_month': 59.90,
      '3_months': 129.90,
      '6_months': 179.90
    }
  },
  {
    id: 'nudz',
    name: 'NUDZ',
    url: 'nudz.com',
    category: 'Straight',
    status: 'Waiting',
    sites: [
      'glaminogirls.com', 'lifepornstories.com', 'unrealporn.com',
      'creativeporn.com', 'spy26.com', 'movieporn.com', 'loveasmr.com',
      'ghost-porn.com', 'fuckmesensei.com', 'therapyasmr.com'
    ],
    pricing: {
      '1_month': 39.90,
      '3_months': 79.90,
      '6_months': 129.90
    }
  }
]

// Individual site pricing (varies by network)
export const SITE_PRICING = {
  czechav: {
    '1_month': 29.90,
    '3_months': 64.90,
    '6_months': 99.90
  },
  czechgav: {
    '1_month': 19.90,
    '3_months': 44.90,
    '6_months': 79.90
  },
  goperv: {
    '1_month': 34.90,
    '3_months': 74.90,
    '6_months': 129.90
  },
  xxl: {
    '1_month': 34.90,
    '3_months': 74.90,
    '6_months': 129.90
  },
  nudz: {
    '1_month': 29.90,
    '3_months': 64.90,
    '6_months': 99.90
  },
  standalone: {
    '1_month': 29.90,
    '3_months': 64.90,
    '6_months': 99.90
  }
}

// All individual sites
export const SITES: Site[] = [
  // CzechAV sites
  ...NETWORKS[0].sites.map(url => ({
    id: url.replace(/https?:\/\/|\.com.*$/g, ''),
    url,
    network: 'CzechAV',
    type: 'site' as const,
    status: url.includes('students') || url.includes('jacker') ? 'Waiting' as const : 'Active' as const,
    category: 'Straight' as const,
    pricing: SITE_PRICING.czechav
  })),
  
  // CzechGAV sites
  ...NETWORKS[1].sites.map(url => ({
    id: url.replace(/https?:\/\/|\.com.*$/g, ''),
    url,
    network: 'CzechGAV',
    type: 'site' as const,
    status: 'Active' as const,
    category: 'Gay' as const,
    pricing: SITE_PRICING.czechgav
  })),
  
  // GoPerv sites
  ...NETWORKS[2].sites.map(url => ({
    id: url.replace(/https?:\/\/|\.com.*$/g, ''),
    url,
    network: 'GoPerv',
    type: 'site' as const,
    status: url.includes('clubbdsm') || url.includes('selfiefetish') ? 'Waiting' as const : 'Active' as const,
    category: 'Straight' as const,
    pricing: SITE_PRICING.goperv
  })),
  
  // XXL sites
  ...NETWORKS[3].sites.map(url => ({
    id: url.replace(/https?:\/\/|\.com.*$/g, ''),
    url,
    network: 'XXL',
    type: 'site' as const,
    status: url.includes('xxl') && !url.includes('gang') ? 'Waiting' as const : 'Active' as const,
    category: 'Straight' as const,
    pricing: SITE_PRICING.xxl
  })),
  
  // NUDZ sites
  ...NETWORKS[4].sites.map(url => ({
    id: url.replace(/https?:\/\/|\.com.*$/g, ''),
    url,
    network: 'NUDZ',
    type: 'site' as const,
    status: 'Active' as const,
    category: 'Straight' as const,
    pricing: SITE_PRICING.nudz
  })),
  
  // Standalone site
  {
    id: 'czechcasting',
    url: 'czechcasting.com',
    network: 'None',
    type: 'site' as const,
    status: 'Active' as const,
    category: 'Straight' as const,
    pricing: SITE_PRICING.standalone
  }
]

// Calculate statistics
export const PRODUCT_STATS = {
  totalSites: SITES.length,
  activeSites: SITES.filter(s => s.status === 'Active').length,
  totalNetworks: NETWORKS.length,
  activeNetworks: NETWORKS.filter(n => n.status === 'Active').length,
  
  // Average prices across all products (using only active sites)
  averagePrices: {
    sites: {
      '1_month': SITES.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.pricing['1_month'], 0) / SITES.filter(s => s.status === 'Active').length,
      '3_months': SITES.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.pricing['3_months'], 0) / SITES.filter(s => s.status === 'Active').length,
      '6_months': SITES.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.pricing['6_months'], 0) / SITES.filter(s => s.status === 'Active').length
    },
    networks: {
      '1_month': NETWORKS.reduce((sum, n) => sum + n.pricing['1_month'], 0) / NETWORKS.length,
      '3_months': NETWORKS.reduce((sum, n) => sum + n.pricing['3_months'], 0) / NETWORKS.length,
      '6_months': NETWORKS.reduce((sum, n) => sum + n.pricing['6_months'], 0) / NETWORKS.length
    }
  }
}

// Product filter types
export type ProductFilter = 'all' | 'networks' | 'sites'

// Get filtered products based on selection
export function getFilteredProducts(filter: ProductFilter) {
  switch (filter) {
    case 'networks':
      return { networks: NETWORKS, sites: [] }
    case 'sites':
      return { networks: [], sites: SITES }
    case 'all':
    default:
      return { networks: NETWORKS, sites: SITES }
  }
}

// Calculate weighted average price based on actual distribution
export function calculateWeightedPrice(
  filter: ProductFilter,
  period: '1_month' | '3_months' | '6_months',
  networkPercentage: number = 35 // percentage choosing networks vs sites
) {
  const products = getFilteredProducts(filter)
  
  if (filter === 'networks') {
    // Use all networks (including waiting as they have active sites)
    return products.networks.reduce((sum, n) => sum + n.pricing[period], 0) / products.networks.length
  }
  
  if (filter === 'sites') {
    // Only use active sites for average calculation
    const activeSites = products.sites.filter(s => s.status === 'Active')
    return activeSites.reduce((sum, s) => sum + s.pricing[period], 0) / activeSites.length
  }
  
  // For 'all', calculate weighted average using only active sites
  const avgNetworkPrice = NETWORKS.reduce((sum, n) => sum + n.pricing[period], 0) / NETWORKS.length
  const activeSitesAll = SITES.filter(s => s.status === 'Active')
  const avgSitePrice = activeSitesAll.reduce((sum, s) => sum + s.pricing[period], 0) / activeSitesAll.length
  
  return (avgNetworkPrice * networkPercentage + avgSitePrice * (100 - networkPercentage)) / 100
}
// Pricing configuration for all products and subscription periods

export interface PricingTier {
  period: '1_month' | '3_months' | '6_months'
  monthlyPrice: number
  totalPrice: number
  discount: number
}

export interface Product {
  id: string
  name: string
  type: 'single' | 'bundle'
  sitesIncluded: number
  pricing: PricingTier[]
}

// Pricing for Single Site products (70 different projects)
export const SINGLE_SITE_PRICING: PricingTier[] = [
  {
    period: '1_month',
    monthlyPrice: 29.90,
    totalPrice: 29.90,
    discount: 0
  },
  {
    period: '3_months',
    monthlyPrice: 21.63,
    totalPrice: 64.89, // 21.63 * 3
    discount: 27.6 // ~28% discount
  },
  {
    period: '6_months',
    monthlyPrice: 16.65,
    totalPrice: 99.90, // 16.65 * 6
    discount: 44.3 // ~44% discount
  }
]

// Pricing for Bundle (32 sites)
export const BUNDLE_PRICING: PricingTier[] = [
  {
    period: '1_month',
    monthlyPrice: 39.90,
    totalPrice: 957.00, // Total value if bought separately
    discount: 0
  },
  {
    period: '3_months',
    monthlyPrice: 26.63,
    totalPrice: 79.89, // 26.63 * 3 (actual price paid)
    discount: 33.3 // ~33% discount
  },
  {
    period: '6_months',
    monthlyPrice: 21.65,
    totalPrice: 129.90, // 21.65 * 6 (actual price paid)
    discount: 45.7 // ~46% discount
  }
]

// Product catalog
export const PRODUCTS: Product[] = [
  // 70 Single Site Products
  ...Array.from({ length: 70 }, (_, i) => ({
    id: `single_${i + 1}`,
    name: `Project ${i + 1}`,
    type: 'single' as const,
    sitesIncluded: 1,
    pricing: SINGLE_SITE_PRICING
  })),
  // Bundle Product
  {
    id: 'bundle_1',
    name: 'Complete Bundle',
    type: 'bundle',
    sitesIncluded: 32,
    pricing: BUNDLE_PRICING
  }
]

// Distribution assumptions (can be adjusted based on real data)
export const PRODUCT_DISTRIBUTION = {
  singleVsBundle: {
    single: 65, // 65% choose single sites
    bundle: 35  // 35% choose bundle
  },
  subscriptionPeriod: {
    '1_month': 40,  // 40% choose monthly
    '3_months': 35, // 35% choose 3 months
    '6_months': 25  // 25% choose 6 months
  },
  // Distribution among the 70 single products (assuming equal for simplicity)
  singleProductDistribution: Array.from({ length: 70 }, () => 1.43) // ~1.43% each
}

// Calculate weighted average price based on distribution
export function calculateWeightedAveragePrice(): number {
  const { singleVsBundle, subscriptionPeriod } = PRODUCT_DISTRIBUTION
  
  let totalRevenue = 0
  let totalCustomers = 100 // Base 100 for percentage calculations
  
  // Single site revenue
  const singleCustomers = totalCustomers * (singleVsBundle.single / 100)
  SINGLE_SITE_PRICING.forEach(tier => {
    const periodCustomers = singleCustomers * (subscriptionPeriod[tier.period] / 100)
    totalRevenue += periodCustomers * tier.monthlyPrice
  })
  
  // Bundle revenue
  const bundleCustomers = totalCustomers * (singleVsBundle.bundle / 100)
  BUNDLE_PRICING.forEach(tier => {
    const periodCustomers = bundleCustomers * (subscriptionPeriod[tier.period] / 100)
    totalRevenue += periodCustomers * tier.monthlyPrice
  })
  
  return totalRevenue / totalCustomers
}

// Get rebill rates based on subscription period
export function getRebillRate(period: '1_month' | '3_months' | '6_months'): number {
  // Longer subscriptions typically have higher retention
  const rates = {
    '1_month': 85,   // 85% monthly retention
    '3_months': 92,  // 92% quarterly retention
    '6_months': 95   // 95% semi-annual retention
  }
  return rates[period]
}

// Calculate total monthly recurring revenue
export function calculateMRR(
  visitors: number,
  registrationRate: number,
  purchaseRate: number
): {
  singleMRR: number
  bundleMRR: number
  totalMRR: number
  avgCustomerValue: number
} {
  const signups = visitors * (registrationRate / 100)
  const purchases = signups * (purchaseRate / 100)
  
  const { singleVsBundle, subscriptionPeriod } = PRODUCT_DISTRIBUTION
  
  // Calculate single site MRR
  const singlePurchases = purchases * (singleVsBundle.single / 100)
  let singleMRR = 0
  SINGLE_SITE_PRICING.forEach(tier => {
    const periodCustomers = singlePurchases * (subscriptionPeriod[tier.period] / 100)
    const retention = getRebillRate(tier.period) / 100
    singleMRR += periodCustomers * tier.monthlyPrice * retention
  })
  
  // Calculate bundle MRR
  const bundlePurchases = purchases * (singleVsBundle.bundle / 100)
  let bundleMRR = 0
  BUNDLE_PRICING.forEach(tier => {
    const periodCustomers = bundlePurchases * (subscriptionPeriod[tier.period] / 100)
    const retention = getRebillRate(tier.period) / 100
    bundleMRR += periodCustomers * tier.monthlyPrice * retention
  })
  
  const totalMRR = singleMRR + bundleMRR
  const avgCustomerValue = purchases > 0 ? totalMRR / purchases : 0
  
  return {
    singleMRR,
    bundleMRR,
    totalMRR,
    avgCustomerValue
  }
}
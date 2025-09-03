// Data import types for real website and transaction data

export interface WebsiteAnalytics {
  period: {
    month: string // 'July 2024', 'August 2024'
    startDate: string
    endDate: string
  }
  metrics: {
    totalVisitors: number
    uniqueVisitors: number
    pageViews: number
    signups: number
    trialStarts: number
    conversionRate: number // signup rate
  }
  sources: {
    organic: number
    paid: number
    direct: number
    referral: number
    social: number
  }
}

export interface TransactionData {
  period: {
    month: string
    startDate: string
    endDate: string
  }
  summary: {
    totalTransactions: number
    newCustomers: number
    recurringCustomers: number
    totalRevenue: number
    averageOrderValue: number
    refunds: number
    chargebacks: number
  }
  subscriptions: {
    newSubscriptions: number
    cancelledSubscriptions: number
    activeSubscriptions: number
    rebillRate: number
    churnRate: number
    mrr: number // Monthly Recurring Revenue
  }
  products: Array<{
    name: string
    price: number
    quantity: number
    revenue: number
  }>
}

export interface ImportedDataset {
  id: string
  name: string
  importedAt: Date
  websiteData: WebsiteAnalytics
  transactionData: TransactionData
  calculatedMetrics: {
    visitors: number
    registrationRate: number
    joinRate: number
    averagePrice: number
    rebillRate: number
    totalRevenue: number
    profit: number
  }
}

export interface CSVRow {
  [key: string]: string | number
}

export interface DataMapping {
  sourceField: string
  targetNode: string
  transformation?: (value: any) => number
}
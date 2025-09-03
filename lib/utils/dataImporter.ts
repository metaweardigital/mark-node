import { WebsiteAnalytics, TransactionData, ImportedDataset } from '@/types/import.types'

export class DataImporter {
  /**
   * Parse CSV file content into array of objects
   */
  static parseCSV(csvContent: string): Record<string, any>[] {
    const lines = csvContent.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const data: Record<string, any>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: Record<string, any> = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        // Try to parse as number if possible
        row[header] = isNaN(Number(value)) ? value : Number(value)
      })
      
      data.push(row)
    }

    return data
  }

  /**
   * Parse JSON file content
   */
  static parseJSON(jsonContent: string): any {
    try {
      return JSON.parse(jsonContent)
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
  }

  /**
   * Process website analytics data from various formats
   */
  static processWebsiteData(data: any, month: string): WebsiteAnalytics {
    // Handle Google Analytics format
    if (data.users !== undefined && data.sessions !== undefined) {
      return {
        period: {
          month,
          startDate: data.startDate || '',
          endDate: data.endDate || ''
        },
        metrics: {
          totalVisitors: data.sessions || 0,
          uniqueVisitors: data.users || 0,
          pageViews: data.pageviews || 0,
          signups: data.goalCompletions || data.signups || 0,
          trialStarts: data.trials || 0,
          conversionRate: data.conversionRate || (data.signups / data.users * 100) || 0
        },
        sources: {
          organic: data.organicSearches || 0,
          paid: data.paidSearch || 0,
          direct: data.directTraffic || 0,
          referral: data.referralTraffic || 0,
          social: data.socialTraffic || 0
        }
      }
    }

    // Handle custom format
    return {
      period: {
        month,
        startDate: data.startDate || '',
        endDate: data.endDate || ''
      },
      metrics: {
        totalVisitors: data.totalVisitors || data.visitors || 0,
        uniqueVisitors: data.uniqueVisitors || data.unique || 0,
        pageViews: data.pageViews || data.views || 0,
        signups: data.signups || data.registrations || 0,
        trialStarts: data.trialStarts || data.trials || 0,
        conversionRate: data.conversionRate || 0
      },
      sources: data.sources || {
        organic: 0,
        paid: 0,
        direct: 0,
        referral: 0,
        social: 0
      }
    }
  }

  /**
   * Process transaction data from various formats
   */
  static processTransactionData(data: any, month: string): TransactionData {
    // Handle Stripe format
    if (data.charges || data.subscriptions) {
      const charges = data.charges || []
      const subscriptions = data.subscriptions || []
      
      return {
        period: {
          month,
          startDate: data.startDate || '',
          endDate: data.endDate || ''
        },
        summary: {
          totalTransactions: charges.length,
          newCustomers: data.newCustomers || 0,
          recurringCustomers: data.recurringCustomers || 0,
          totalRevenue: charges.reduce((sum: number, c: any) => sum + (c.amount / 100), 0),
          averageOrderValue: charges.length > 0 
            ? charges.reduce((sum: number, c: any) => sum + (c.amount / 100), 0) / charges.length 
            : 0,
          refunds: data.refunds || 0,
          chargebacks: data.disputes || 0
        },
        subscriptions: {
          newSubscriptions: subscriptions.filter((s: any) => s.status === 'active').length,
          cancelledSubscriptions: subscriptions.filter((s: any) => s.status === 'canceled').length,
          activeSubscriptions: subscriptions.filter((s: any) => s.status === 'active').length,
          rebillRate: data.rebillRate || 85,
          churnRate: data.churnRate || 15,
          mrr: data.mrr || 0
        },
        products: data.products || []
      }
    }

    // Handle custom format
    return {
      period: {
        month,
        startDate: data.startDate || '',
        endDate: data.endDate || ''
      },
      summary: {
        totalTransactions: data.totalTransactions || data.transactions || 0,
        newCustomers: data.newCustomers || data.newUsers || 0,
        recurringCustomers: data.recurringCustomers || data.returning || 0,
        totalRevenue: data.totalRevenue || data.revenue || 0,
        averageOrderValue: data.averageOrderValue || data.aov || 0,
        refunds: data.refunds || 0,
        chargebacks: data.chargebacks || 0
      },
      subscriptions: data.subscriptions || {
        newSubscriptions: 0,
        cancelledSubscriptions: 0,
        activeSubscriptions: 0,
        rebillRate: 85,
        churnRate: 15,
        mrr: 0
      },
      products: data.products || []
    }
  }

  /**
   * Calculate flow metrics from imported data
   */
  static calculateFlowMetrics(
    websiteData: WebsiteAnalytics,
    transactionData: TransactionData
  ): ImportedDataset['calculatedMetrics'] {
    const visitors = websiteData.metrics.uniqueVisitors
    const signups = websiteData.metrics.signups
    const joins = transactionData.summary.newCustomers
    const revenue = transactionData.summary.totalRevenue
    const averagePrice = transactionData.summary.averageOrderValue
    
    return {
      visitors,
      registrationRate: visitors > 0 ? (signups / visitors) * 100 : 0,
      joinRate: signups > 0 ? (joins / signups) * 100 : 0,
      averagePrice,
      rebillRate: transactionData.subscriptions.rebillRate,
      totalRevenue: revenue,
      profit: revenue * 0.6 // Assuming 60% profit margin
    }
  }

  /**
   * Create a complete dataset from imported files
   */
  static createDataset(
    name: string,
    websiteData: WebsiteAnalytics,
    transactionData: TransactionData
  ): ImportedDataset {
    return {
      id: `dataset-${Date.now()}`,
      name,
      importedAt: new Date(),
      websiteData,
      transactionData,
      calculatedMetrics: this.calculateFlowMetrics(websiteData, transactionData)
    }
  }
}
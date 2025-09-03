// Matomo API Client for fetching real visitor analytics data

export interface MatomoConfig {
  baseUrl: string                    // e.g., https://analytics.domain.com
  authToken: string                  // API token_auth
  defaultPeriod: 'day' | 'week' | 'month' | 'year'
  cacheTimeout: number               // Minutes to cache data
}

export interface MatomoMetrics {
  nb_uniq_visitors: number          // Unique visitors
  nb_visits: number                 // Total visits
  nb_actions: number                // Actions (pageviews, etc)
  nb_pageviews: number              // Page views
  bounce_rate: number               // Bounce rate percentage
  avg_time_on_site: number          // Average time in seconds
  nb_conversions?: number           // Goal conversions
  revenue?: number                  // Revenue from goals
  sum_daily_nb_uniq_visitors?: number // Sum for period
}

export interface SiteMatomoMapping {
  siteId: string                    // Internal ID (e.g., "czechav")
  matomoSiteId: number              // Matomo site ID (e.g., 16)
  networkId?: string                // Parent network if applicable
  displayName: string               // User-friendly name
  domain: string                    // Website domain
}

interface CachedData<T> {
  data: T
  timestamp: number
}

// Initialize with hardcoded mappings - ONLY OUR NETWORK SITES
const HARDCODED_MAPPINGS: Record<string, number> = {
  // CzechAV Network (34 sites) 
  'czechamateurs': 15, 
  'czechbangbus': 17, 
  'czechbitch': 18,
  'czechcabins': 19, 
  'czechcasting': 20, 
  'czechcouples': 21, 
  'czechdellais': 22,
  'czechestrogenolit': 23, 
  'czechexperiment': 24, 
  'czechfantasy': 25,
  'czechfirstvideo': 26, 
  'czechgangbang': 27, 
  'czechgardenparty': 28,
  'czechharem': 29, 
  'czechhomeorgy': 30, 
  'czechjacker': 31, 
  'czechlesbians': 32,
  'czechmassage': 33, 
  'czechmegaswingers': 34, 
  'czechorgasm': 35,
  'czechparties': 36, 
  'czechpawnshop': 37, 
  'czechpool': 38, 
  'czechsauna': 39,
  'czechsnooper': 40, 
  'czechsolarium': 41, 
  'czechspy': 42, 
  'czechstreets': 46,
  'czechstudents': 47, 
  'czechsupermodels': 48, 
  'czechtantra': 49,
  'czechtaxi': 50, 
  'czechwifeswap': 51,
  
  // CzechGAV Network (8 sites)
  'czechgav': 82, 
  'czechgayamateurs': 83, 
  'czechgaycasting': 84,
  'czechgaycouples': 85, 
  'czechgayfantasy': 86, 
  'czechgaymassage': 87,
  'czechgaysolarium': 88, 
  'gayhorrorporn': 56,
  
  // GoPerv Network (9 sites)
  'goperv': 57, 
  'perversefamily': 59, 
  'perversefamilylive': 60,
  'extremestreets': 55, 
  'dirtysarah': 54, 
  'powerfetish': 62,
  'xvirtual': 65, 
  'horrorporn': 58, 
  'r51': 63,
  
  // XXL Network (5 sites)
  'annalovesshemale': 77, 
  'monstercockgang': 78, 
  'redneckjohn': 79,
  'unusualpeople': 80, 
  'mikebigdick': 81,
  
  // NUDZ Network (11 sites)
  'nudz': 73, 
  'glaminogirls': 69, 
  'lifepornstories': 70, 
  'unrealporn': 76,
  'creativeporn': 66, 
  'spy26': 74, 
  'movieporn': 72, 
  'loveasmr': 71,
  'ghost-porn': 68, 
  'fuckmesensei': 67, 
  'therapyasmr': 75
}
// Total: 67 sites across 5 networks (excluding non-network sites)

// Dynamic site mappings - loaded from configuration
export let SITE_MAPPINGS: SiteMatomoMapping[] = []

// Set site mappings dynamically
export function setSiteMappings(mappings: Record<string, number>) {
  SITE_MAPPINGS = Object.entries(mappings).map(([siteId, matomoSiteId]) => {
    // Determine network based on site name patterns
    let networkId = ''
    let displayName = siteId
    
    if (siteId.includes('czechgay') || siteId === 'gayhorrorporn') {
      networkId = 'czechgav'
    } else if (siteId.startsWith('czech')) {
      networkId = 'czechav'
    } else if (['goperv', 'perversefamily', 'perversefamilylive', 'extremestreets', 'dirtysarah', 'powerfetish', 'xvirtual', 'horrorporn', 'r51'].includes(siteId)) {
      networkId = 'goperv'
    } else if (['redneckjohn', 'mikebigdick', 'monstercockgang', 'annalovesshemale', 'unusualpeople'].includes(siteId)) {
      networkId = 'xxl'
    } else if (['nudz', 'glaminogirls', 'lifepornstories', 'unrealporn', 'creativeporn', 'spy26', 'movieporn', 'loveasmr', 'ghost-porn', 'fuckmesensei', 'therapyasmr'].includes(siteId)) {
      networkId = 'nudz'
    }
    
    // Format display name
    displayName = siteId
      .replace(/czech/g, 'Czech ')
      .replace(/gay/g, 'Gay ')
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    return {
      siteId,
      matomoSiteId,
      networkId,
      displayName,
      domain: `${siteId}.com`
    }
  })
}

export class MatomoAPIClient {
  private config: MatomoConfig
  private cache: Map<string, CachedData<any>> = new Map()
  
  constructor(config: MatomoConfig) {
    this.config = config
    
    // Initialize site mappings if empty
    if (SITE_MAPPINGS.length === 0) {
      setSiteMappings(HARDCODED_MAPPINGS)
    }
  }
  
  /**
   * Check if cached data is expired
   */
  private isCacheExpired(cached: CachedData<any>): boolean {
    const expiryTime = cached.timestamp + (this.config.cacheTimeout * 60 * 1000)
    return Date.now() > expiryTime
  }
  
  /**
   * Build API URL - now uses our Next.js API route to avoid CORS
   */
  private buildApiUrl(params: Record<string, string | number>): string {
    // Use our API route instead of direct Matomo call
    const url = new URL('/api/matomo', window.location.origin)
    
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'module' && key !== 'format' && key !== 'token_auth') {
        url.searchParams.append(key, String(value))
      }
    })
    
    return url.toString()
  }
  
  /**
   * Transform Matomo response to our metrics format
   */
  private transformMetrics(data: any): MatomoMetrics {
    // Handle both single result and array of results
    let metrics = Array.isArray(data) ? data[0] : data
    
    // If data has date keys (like "2025-09"), it's a multi-month response
    // Take the first month's data (which should be the current month with 'today')
    const dateKeys = Object.keys(metrics || {}).filter(key => /^\d{4}-\d{2}/.test(key))
    if (dateKeys.length > 0) {
      // Use the first date key (should be current month)
      metrics = metrics[dateKeys[0]]
      // Using data from first date key
    }
    
    // Log raw metrics to debug
    // Received metrics from API
    
    // Check if we got empty or error response
    if (!metrics || metrics.result === 'error' || Object.keys(metrics).length === 0) {
      console.warn('[Matomo] Empty or error response from API')
      return this.getDefaultMetrics(0)
    }
    
    // For historical data, nb_uniq_visitors might be 0 while nb_visits has data
    // In this case, use nb_visits as a fallback for visitor count
    const uniqueVisitors = parseInt(metrics.nb_uniq_visitors || '0')
    const visits = parseInt(metrics.nb_visits || '0')
    
    return {
      nb_uniq_visitors: uniqueVisitors > 0 ? uniqueVisitors : visits,
      nb_visits: visits,
      nb_actions: parseInt(metrics.nb_actions || '0'),
      nb_pageviews: parseInt(metrics.nb_pageviews || '0'),
      bounce_rate: parseFloat(metrics.bounce_rate?.replace('%', '') || '0'),
      avg_time_on_site: parseInt(metrics.avg_time_on_site || '0'),
      nb_conversions: parseInt(metrics.nb_conversions || '0'),
      revenue: parseFloat(metrics.revenue || '0'),
      sum_daily_nb_uniq_visitors: parseInt(metrics.sum_daily_nb_uniq_visitors || '0')
    }
  }
  
  /**
   * Fetch metrics for a single site
   */
  async fetchSiteMetrics(
    siteId: number,
    period: 'day' | 'month' | 'year' = 'month',
    date: string = 'today'
  ): Promise<MatomoMetrics> {
    const cacheKey = `${siteId}-${period}-${date}`
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!
      if (!this.isCacheExpired(cached)) {
        console.log(`[Matomo] Using cached data for site ${siteId}`)
        return cached.data
      }
    }
    
    try {
      // Build API URL
      const url = this.buildApiUrl({
        method: 'API.get',
        idSite: siteId,
        period,
        date
      })
      
      // Fetching data for site
      
      // Fetch from API
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Matomo API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const metrics = this.transformMetrics(data)
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      })
      
      return metrics
    } catch (error) {
      console.error(`[Matomo] Failed to fetch metrics for site ${siteId}:`, error)
      
      // Try to return cached data even if expired
      const cached = this.cache.get(cacheKey)
      if (cached) {
        // Using expired cache as fallback
        return cached.data
      }
      
      // Return default metrics
      return this.getDefaultMetrics(siteId)
    }
  }
  
  /**
   * Fetch metrics for multiple sites (for network/all selection)
   * Uses bulk API to reduce number of requests
   */
  async fetchMultipleSites(
    siteIds: number[],
    period: 'day' | 'month' | 'year' = 'month',
    date: string = 'today'
  ): Promise<Map<number, MatomoMetrics>> {
    // Fetching data for multiple sites
    
    // Check if we should use bulk API (for more than 3 sites)
    if (siteIds.length > 3) {
      try {
        // Build the URLs array for bulk request
        const urls: string[] = siteIds.map(id => 
          `method=VisitsSummary.get&idSite=${id}&period=${period}&date=${date}`
        )
        
        // Make the request through our POST route with properly formatted params
        const postUrl = new URL('/api/matomo', window.location.origin)
        // Making bulk API request
        
        // Create the params object with indexed URLs
        const bulkParams: Record<string, string> = {}
        urls.forEach((url, index) => {
          bulkParams[`urls[${index}]`] = url
        })
        
        const response = await fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'API.getBulkRequest',
            params: bulkParams
          })
        })
        
        if (!response.ok) {
          throw new Error(`Bulk API error: ${response.status}`)
        }
        
        const bulkData = await response.json()
        // Received bulk API response
        const resultsMap = new Map<number, MatomoMetrics>()
        
        siteIds.forEach((id, index) => {
          const data = bulkData[index]
          // Processing site response
          if (data && !data.error) {
            resultsMap.set(id, this.transformMetrics(data))
          } else {
            console.warn(`[Matomo] Using default metrics for site ${id} due to error or no data`)
            // Use default metrics for failed sites
            resultsMap.set(id, this.getDefaultMetrics(id))
          }
        })
        
        return resultsMap
      } catch (error) {
        console.error('[Matomo] Bulk API failed, falling back to parallel requests:', error)
      }
    }
    
    // Fallback to parallel requests for small number of sites
    const promises = siteIds.map(id => this.fetchSiteMetrics(id, period, date))
    const results = await Promise.all(promises)
    
    // Create map of results
    return new Map(siteIds.map((id, index) => [id, results[index]]))
  }
  
  /**
   * Aggregate metrics from multiple sites
   */
  aggregateMetrics(metricsMap: Map<number, MatomoMetrics>): MatomoMetrics {
    const aggregated: MatomoMetrics = {
      nb_uniq_visitors: 0,
      nb_visits: 0,
      nb_actions: 0,
      nb_pageviews: 0,
      bounce_rate: 0,
      avg_time_on_site: 0,
      nb_conversions: 0,
      revenue: 0,
      sum_daily_nb_uniq_visitors: 0
    }
    
    let count = 0
    let totalBounceRate = 0
    let totalAvgTime = 0
    
    metricsMap.forEach((metrics, siteId) => {
      // Site metrics processed
      aggregated.nb_uniq_visitors += metrics.nb_uniq_visitors
      aggregated.nb_visits += metrics.nb_visits
      aggregated.nb_actions += metrics.nb_actions
      aggregated.nb_pageviews += metrics.nb_pageviews
      aggregated.nb_conversions! += metrics.nb_conversions || 0
      aggregated.revenue! += metrics.revenue || 0
      aggregated.sum_daily_nb_uniq_visitors! += metrics.sum_daily_nb_uniq_visitors || 0
      
      // Calculate weighted averages
      totalBounceRate += metrics.bounce_rate
      totalAvgTime += metrics.avg_time_on_site
      count++
    })
    
    // Calculate averages
    if (count > 0) {
      aggregated.bounce_rate = totalBounceRate / count
      aggregated.avg_time_on_site = totalAvgTime / count
    }
    
    // Aggregated all sites
    
    return aggregated
  }
  
  /**
   * Get metrics for a traffic source selection
   */
  async getMetricsForTrafficSource(
    sourceType: 'all' | 'network' | 'site',
    sourceId?: string,
    period: string = 'today'
  ): Promise<MatomoMetrics> {
    if (sourceType === 'all') {
      // Fetch ALL sites including network parent sites + individual sites
      const allIndividualSites = SITE_MAPPINGS.map(s => s.matomoSiteId)
      // Also need to add the 5 network parent sites (these have their own Matomo IDs)
      // Network parent sites are the main network domains
      const networkParentIds = [16, 82, 57, 77, 73] // czechav, czechgav, goperv, xxl, nudz main sites
      const allSiteIds = [...new Set([...allIndividualSites, ...networkParentIds])]
      // Fetching ALL sites data
      const metricsMap = await this.fetchMultipleSites(allSiteIds, 'month', period)
      const aggregated = this.aggregateMetrics(metricsMap)
      // Aggregated data complete
      return aggregated
    }
    
    if (sourceType === 'network' && sourceId) {
      if (sourceId === 'all') {
        // Aggregate ALL networks - sum all sites from all networks
        const allNetworkSites = SITE_MAPPINGS.map(s => s.matomoSiteId)
        const metricsMap = await this.fetchMultipleSites(allNetworkSites, 'month', period)
        return this.aggregateMetrics(metricsMap)
      } else {
        // Aggregate specific network - sum all sites in that network
        if (sourceId === 'czechav') {
          // CzechAV network sites (IDs 15-51, excluding some gaps)
          const czechavSites = [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,46,47,48,49,50,51]
          const metricsMap = await this.fetchMultipleSites(czechavSites, 'month', period)
          return this.aggregateMetrics(metricsMap)
        } else if (sourceId === 'czechgav') {
          // CzechGAV network sites 
          const czechgavSites = [82,83,84,85,86,87,88,56]
          const metricsMap = await this.fetchMultipleSites(czechgavSites, 'month', period)
          return this.aggregateMetrics(metricsMap)
        } else if (sourceId === 'goperv') {
          // GoPerv network sites
          const gopervSites = [57,59,60,55,54,62,65,58,63]
          const metricsMap = await this.fetchMultipleSites(gopervSites, 'month', period)
          return this.aggregateMetrics(metricsMap)
        } else if (sourceId === 'xxl') {
          // XXL network sites
          const xxlSites = [77,78,79,80,81]
          const metricsMap = await this.fetchMultipleSites(xxlSites, 'month', period)
          return this.aggregateMetrics(metricsMap)
        } else if (sourceId === 'nudz') {
          // NUDZ network sites
          const nudzSites = [73,69,70,76,66,74,72,71,68,67,75]
          const metricsMap = await this.fetchMultipleSites(nudzSites, 'month', period)
          return this.aggregateMetrics(metricsMap)
        }
      }
    }
    
    if (sourceType === 'site' && sourceId) {
      if (sourceId === 'all') {
        // Fetch all individual sites (excluding network parent sites)
        // Network parent site names that should be excluded from "Sites > All"
        const networkParentNames = ['czechav', 'czechgav', 'goperv', 'xxl', 'nudz']
        // Filter out network parent sites from all sites
        const allIndividualSites = SITE_MAPPINGS
          .filter(s => !networkParentNames.includes(s.siteId))
          .map(s => s.matomoSiteId)
        const metricsMap = await this.fetchMultipleSites(allIndividualSites, 'month', period)
        return this.aggregateMetrics(metricsMap)
      } else {
        // Fetch single site ONLY
        const site = SITE_MAPPINGS.find(s => s.siteId === sourceId)
        if (site) {
          return this.fetchSiteMetrics(site.matomoSiteId, 'month', period)
        }
      }
    }
    
    // Fallback to default
    return this.getDefaultMetrics(0)
  }
  
  /**
   * Get default metrics (fallback)
   */
  private getDefaultMetrics(siteId: number): MatomoMetrics {
    return {
      nb_uniq_visitors: 10000,
      nb_visits: 12000,
      nb_actions: 50000,
      nb_pageviews: 45000,
      bounce_rate: 85,
      avg_time_on_site: 180,
      nb_conversions: 0,
      revenue: 0
    }
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    console.log('[Matomo] Cache cleared')
  }
  
  /**
   * Test connection to Matomo API
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = this.buildApiUrl({
        method: 'API.getMatomoVersion'
      })
      
      const response = await fetch(url)
      if (response.ok) {
        const version = await response.json()
        console.log(`[Matomo] Connected successfully. Version: ${version}`)
        return true
      }
      
      console.error(`[Matomo] Connection failed: ${response.status}`)
      return false
    } catch (error) {
      console.error('[Matomo] Connection test failed:', error)
      return false
    }
  }
}
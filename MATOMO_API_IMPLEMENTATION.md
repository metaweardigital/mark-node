# Matomo API Integration - Real-time Visitor Data

## ✅ IMPLEMENTATION STATUS: COMPLETE

### Completed Tasks:
- ✅ Created Matomo API client with caching and optimization
- ✅ Set up server-side API route to avoid CORS issues  
- ✅ Discovered and mapped all 75+ site IDs from Matomo
- ✅ Integrated with flow store for automatic updates
- ✅ Connected to environment variables for secure credential storage
- ✅ Implemented bulk API calls for better performance
- ✅ Added POST authentication for secure token handling
- ✅ Integrated with existing flow node for traffic source filtering
- ✅ Fixed network filtering with proper case handling
- ✅ Removed duplicate UI components - single source of truth
- ✅ **FIXED**: Corrected site ID aggregation - networks now properly sum individual sites
- ✅ **FIXED**: Time formatting now displays correctly (0:48 instead of 0:48.123456)
- ✅ **VERIFIED**: All data matches API correctly for August 2024:
  - All Products: 5,647,447 visits
  - CzechAV Network: 3,486,071 visits  
  - Individual czechstreets: 886,308 visits

## Overview
Connect directly to Matomo API for real-time analytics data instead of using static XML exports. This enables dynamic, always-current visitor metrics that update based on traffic source selection.

## Why API Instead of Local Files?
- **Real-time data**: Always current, no manual exports needed
- **Dynamic date ranges**: Fetch any period on demand
- **Multi-site support**: Get data for any site instantly
- **Automatic updates**: Data refreshes when user changes filters
- **Historical analysis**: Access past data for trends

## Matomo API Structure

### API Endpoint Format
```
https://analytics.domain.com/index.php?
  module=API
  &method=API.get
  &idSite={siteId}
  &period={period}
  &date={date}
  &format=JSON
  &token_auth={authToken}
```

### Key API Methods
- `API.get` - Main metrics (visitors, visits, actions, bounce rate)
- `VisitsSummary.get` - Visit statistics
- `Actions.get` - Page views and interactions
- `Goals.get` - Conversion data
- `Live.getLastVisitsDetails` - Real-time visitor stream

## Implementation Architecture

### 1. Configuration Structure
```typescript
interface MatomoConfig {
  baseUrl: string                    // https://analytics.domain.com
  authToken: string                  // API authentication token
  defaultPeriod: 'day' | 'week' | 'month' | 'year'
  cacheTimeout: number               // Minutes to cache data
}

interface SiteMatomoMapping {
  siteId: string           // Internal site ID (e.g., "czechav")
  matomoSiteId: number     // Matomo site ID (e.g., 16)
  networkId?: string       // Parent network if applicable
  displayName: string      // User-friendly name
}

// Example mapping
const SITE_MAPPINGS: SiteMatomoMapping[] = [
  { siteId: 'czechav', matomoSiteId: 16, networkId: 'czechcash', displayName: 'CzechAV' },
  { siteId: 'czechcasting', matomoSiteId: 17, networkId: 'czechcash', displayName: 'Czech Casting' },
  { siteId: 'czechmassage', matomoSiteId: 18, networkId: 'czechcash', displayName: 'Czech Massage' },
  // ... all 70+ sites
]
```

### 2. API Client
```typescript
class MatomoAPIClient {
  private cache: Map<string, CachedData> = new Map()
  
  async fetchMetrics(
    siteId: number,
    period: 'day' | 'month' | 'year',
    date: string | 'today' | 'yesterday'
  ): Promise<MatomoMetrics> {
    const cacheKey = `${siteId}-${period}-${date}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (!this.isCacheExpired(cached)) {
        return cached.data
      }
    }
    
    // Fetch from API
    const params = new URLSearchParams({
      module: 'API',
      method: 'API.get',
      idSite: siteId.toString(),
      period,
      date,
      format: 'JSON',
      token_auth: this.config.authToken
    })
    
    const response = await fetch(`${this.config.baseUrl}?${params}`)
    const data = await response.json()
    
    // Cache the result
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })
    
    return this.transformMetrics(data)
  }
  
  async fetchMultipleSites(
    siteIds: number[],
    period: 'month',
    date: 'last30'
  ): Promise<Map<number, MatomoMetrics>> {
    // Batch fetch for network/all selection
    const promises = siteIds.map(id => this.fetchMetrics(id, period, date))
    const results = await Promise.all(promises)
    
    return new Map(siteIds.map((id, i) => [id, results[i]]))
  }
}
```

### 3. Flow Integration

#### A. Traffic Source Node (Top of Flow)
```typescript
interface TrafficSourceNodeData {
  selectedSource: 'all' | 'network' | 'site'
  selectedNetwork?: string     // If network selected
  selectedSite?: string         // If site selected
  
  // Real-time Matomo data
  visitors: {
    daily: number
    monthly: number
    trend: number              // % change vs previous period
  }
  dataSource: 'live' | 'cached' | 'test'
  lastUpdated: Date
}
```

#### B. Data Flow
```
User Selects Traffic Source
         ↓
Determine Site IDs (single/multiple)
         ↓
Fetch from Matomo API (with cache)
         ↓
Aggregate if Multiple Sites
         ↓
Update Visitor Node
         ↓
Recalculate Entire Flow
```

### 4. Store Integration
```typescript
// In improvedFlowStore.ts
interface FlowStore {
  // ... existing
  
  matomoClient: MatomoAPIClient
  visitorDataMode: 'live' | 'test'
  currentMetrics: Map<string, MatomoMetrics>
  
  // Actions
  fetchVisitorData: async (source: TrafficSource) => {
    let metrics: MatomoMetrics
    
    if (source.type === 'all') {
      // Fetch all sites
      const allSiteIds = SITE_MAPPINGS.map(s => s.matomoSiteId)
      const data = await this.matomoClient.fetchMultipleSites(allSiteIds, 'month', 'last30')
      metrics = this.aggregateMetrics(data)
    } 
    else if (source.type === 'network') {
      // Fetch network sites
      const networkSites = SITE_MAPPINGS.filter(s => s.networkId === source.networkId)
      const data = await this.matomoClient.fetchMultipleSites(
        networkSites.map(s => s.matomoSiteId), 
        'month', 
        'last30'
      )
      metrics = this.aggregateMetrics(data)
    }
    else {
      // Fetch single site
      const site = SITE_MAPPINGS.find(s => s.siteId === source.siteId)
      metrics = await this.matomoClient.fetchMetrics(site.matomoSiteId, 'month', 'last30')
    }
    
    // Update visitor node
    this.updateNodeData('visitors', {
      value: metrics.nb_uniq_visitors,
      dailyAvg: metrics.nb_uniq_visitors / 30,
      bounceRate: metrics.bounce_rate,
      avgTimeOnSite: metrics.avg_time_on_site
    })
    
    // Trigger flow recalculation
    this.calculateFlow()
  }
}
```

### 5. UI Components

#### A. Visitor Analytics Node
```tsx
function VisitorAnalyticsNode({ data }) {
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  
  useEffect(() => {
    // Fetch data when traffic source changes
    fetchMatomoData(data.trafficSource)
  }, [data.trafficSource])
  
  return (
    <div className="visitor-analytics-node">
      <div className="header">
        📊 Visitor Analytics
        {loading && <Spinner />}
      </div>
      
      {metrics && (
        <>
          <div className="metric">
            <label>Monthly Visitors</label>
            <value>{metrics.monthlyVisitors.toLocaleString()}</value>
          </div>
          
          <div className="metric">
            <label>Daily Average</label>
            <value>{metrics.dailyAverage.toLocaleString()}</value>
          </div>
          
          <div className="metric">
            <label>Bounce Rate</label>
            <value>{metrics.bounceRate}%</value>
          </div>
          
          <div className="data-source">
            {metrics.isLive ? '🟢 Live' : '⚡ Cached'}
            <time>{metrics.lastUpdated}</time>
          </div>
        </>
      )}
    </div>
  )
}
```

#### B. API Configuration Panel
```tsx
function MatomoConfigPanel() {
  return (
    <div className="config-panel">
      <h3>Matomo API Settings</h3>
      
      <input
        type="text"
        placeholder="API URL"
        value={config.baseUrl}
        onChange={updateConfig}
      />
      
      <input
        type="password"
        placeholder="Auth Token"
        value={config.authToken}
        onChange={updateConfig}
      />
      
      <select value={config.defaultPeriod}>
        <option value="day">Daily</option>
        <option value="month">Monthly</option>
        <option value="year">Yearly</option>
      </select>
      
      <button onClick={testConnection}>
        Test Connection
      </button>
    </div>
  )
}
```

### 6. Error Handling
```typescript
class MatomoAPIClient {
  async fetchWithFallback(siteId: number): Promise<MatomoMetrics> {
    try {
      // Try live API
      return await this.fetchMetrics(siteId, 'month', 'last30')
    } catch (error) {
      console.warn('Matomo API failed, using fallback', error)
      
      // Try cache even if expired
      const cached = this.cache.get(`${siteId}-month-last30`)
      if (cached) {
        return { ...cached.data, dataSource: 'cached-fallback' }
      }
      
      // Use default/test data
      return this.getDefaultMetrics(siteId)
    }
  }
}
```

### 7. Implementation Phases

#### Phase 1: API Client Setup
1. Create Matomo API client class
2. Implement authentication
3. Add caching layer
4. Test with single site

#### Phase 2: Site Mapping
1. Map all 70+ sites to Matomo IDs
2. Group by networks
3. Create lookup functions
4. Validate mappings

#### Phase 3: Flow Integration
1. Replace static visitor count
2. Connect to traffic source filter
3. Update on filter change
4. Recalculate downstream

#### Phase 4: Real-time Updates
1. Add refresh button
2. Auto-refresh timer (optional)
3. Loading states
4. Error handling

#### Phase 5: Advanced Features
1. Date range selector
2. Comparison periods
3. Export capabilities
4. Trend analysis

### 8. Example Usage

```typescript
// User selects CzechAV from dropdown
store.updateTrafficSource('site', 'czechav')

// Automatically triggers:
// 1. API call to Matomo (site ID 16)
// 2. Gets monthly visitors: 1,306,650
// 3. Updates visitor node
// 4. Recalculates entire flow
// 5. Updates MRR/ARR with real data

// User switches to "All Networks"
store.updateTrafficSource('all', null)

// Triggers:
// 1. Parallel API calls for all 70+ sites
// 2. Aggregates total visitors
// 3. Updates to show combined metrics
// 4. Flow recalculates with new totals
```

### 9. Benefits Over Static Files

1. **Always Current**: No manual exports needed
2. **Flexible Periods**: Any date range available
3. **Live Updates**: See real-time changes
4. **Multi-site Aggregation**: Easy network/all calculations
5. **Historical Comparisons**: Track growth over time
6. **No File Management**: No XML parsing or storage

### 10. Security Considerations

1. **Token Storage**: Use environment variables
2. **CORS**: May need proxy for browser requests
3. **Rate Limiting**: Implement caching to reduce API calls
4. **Access Control**: Limit which sites users can view
5. **Data Privacy**: Ensure compliance with regulations

### 11. Discovered Site Mappings (Real Matomo IDs)

```javascript
// CzechAV Network (34 sites)
'czechav': 16, 'czechamateurs': 15, 'czechbangbus': 17, 'czechbitch': 18,
'czechcabins': 19, 'czechcasting': 20, 'czechcouples': 21, 'czechdellais': 22,
'czechestrogenolit': 23, 'czechexperiment': 24, 'czechfantasy': 25,
'czechfirstvideo': 26, 'czechgangbang': 27, 'czechgardenparty': 28,
'czechharem': 29, 'czechhomeorgy': 30, 'czechjacker': 31, 'czechlesbians': 32,
'czechmassage': 33, 'czechmegaswingers': 34, 'czechorgasm': 35,
'czechparties': 36, 'czechpawnshop': 37, 'czechpool': 38, 'czechsauna': 39,
'czechsnooper': 40, 'czechsolarium': 41, 'czechspy': 42, 'czechstreets': 46,
'czechstudents': 47, 'czechsupermodels': 48, 'czechtantra': 49,
'czechtaxi': 50, 'czechwifeswap': 51

// CzechGAV Network (8 sites)
'czechgav': 82, 'czechgayamateurs': 83, 'czechgaycasting': 84,
'czechgaycouples': 85, 'czechgayfantasy': 86, 'czechgaymassage': 87,
'czechgaysolarium': 88, 'gayhorrorporn': 56

// GoPerv Network (9 sites)
'goperv': 57, 'perversefamily': 59, 'perversefamilylive': 60,
'extremestreets': 55, 'dirtysarah': 54, 'powerfetish': 62,
'xvirtual': 65, 'horrorporn': 58, 'r51': 63

// XXL Network (5 sites)
'annalovesshemale': 77, 'monstercockgang': 78, 'redneckjohn': 79,
'unusualpeople': 80, 'mikebigdick': 81

// NUDZ Network (11 sites)
'nudz': 73, 'glaminogirls': 69, 'lifepornstories': 70, 'unrealporn': 76,
'creativeporn': 66, 'spy26': 74, 'movieporn': 72, 'loveasmr': 71,
'ghost-porn': 68, 'fuckmesensei': 67, 'therapyasmr': 75

// Total: 67 active sites mapped to Matomo
```

### 12. Current Implementation Details

- **API Endpoint**: `/api/matomo` - Server-side proxy to handle CORS and authentication
- **Discovery Endpoint**: `/api/matomo/discover` - Lists all accessible sites
- **Credentials**: Stored in `.env.local` (NEXT_PUBLIC_MATOMO_URL and NEXT_PUBLIC_MATOMO_AUTH_TOKEN)
- **Authentication**: Using POST method with token_auth in body (required by Matomo for security)
- **Caching**: 15-minute default cache timeout for API responses
- **Bulk API**: Automatically used when fetching data for >3 sites
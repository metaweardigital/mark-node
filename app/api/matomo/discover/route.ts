import { NextResponse } from 'next/server'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL!
const MATOMO_TOKEN = process.env.NEXT_PUBLIC_MATOMO_AUTH_TOKEN!

// Try to discover which site IDs we have access to
export async function GET() {
  const accessibleSites: any[] = []
  
  // Try site IDs 1-100 to see which ones we have access to
  for (let siteId = 1; siteId <= 100; siteId++) {
    try {
      const urlWithoutToken = new URL(MATOMO_URL)
      urlWithoutToken.searchParams.append('module', 'API')
      urlWithoutToken.searchParams.append('method', 'SitesManager.getSiteFromId')
      urlWithoutToken.searchParams.append('format', 'JSON')
      urlWithoutToken.searchParams.append('idSite', siteId.toString())
      
      const response = await fetch(urlWithoutToken.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `token_auth=${encodeURIComponent(MATOMO_TOKEN)}`
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data && !data.result) {
          accessibleSites.push({ 
            id: siteId, 
            name: data.name || data.main_url || `Site ${siteId}`,
            url: data.main_url
          })
          console.log(`[Matomo Discover] Found site ${siteId}: ${data.name}`)
        }
      }
    } catch (error) {
      // Silently skip sites we can't access
    }
  }
  
  return NextResponse.json({
    found: accessibleSites.length,
    sites: accessibleSites
  })
}
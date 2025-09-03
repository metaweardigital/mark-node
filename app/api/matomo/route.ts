import { NextRequest, NextResponse } from 'next/server'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL!
const MATOMO_TOKEN = process.env.NEXT_PUBLIC_MATOMO_AUTH_TOKEN!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const method = searchParams.get('method') || 'VisitsSummary.get'
    const idSite = searchParams.get('idSite')
    const period = searchParams.get('period') || 'month'
    const date = searchParams.get('date') || 'today'
    
    console.log('[Matomo API] Request:', { method, idSite, period, date })
    console.log('[Matomo API] Using URL:', MATOMO_URL)
    console.log('[Matomo API] Token exists:', !!MATOMO_TOKEN)
    
    // Build Matomo API URL
    const apiUrl = new URL(MATOMO_URL)
    apiUrl.searchParams.append('module', 'API')
    apiUrl.searchParams.append('method', method)
    apiUrl.searchParams.append('format', 'JSON')
    apiUrl.searchParams.append('token_auth', MATOMO_TOKEN)
    
    // Add optimization parameters only for metrics calls, not for SitesManager
    if (!method.startsWith('SitesManager')) {
      apiUrl.searchParams.append('showColumns', 'nb_uniq_visitors,nb_visits,nb_actions,nb_pageviews,bounce_rate,avg_time_on_site')
      apiUrl.searchParams.append('hideMetadata', '1')
      apiUrl.searchParams.append('expanded', '0')
      
      if (idSite) apiUrl.searchParams.append('idSite', idSite)
      apiUrl.searchParams.append('period', period)
      apiUrl.searchParams.append('date', date)
    }
    
    // Remove token from URL for POST
    const urlWithoutToken = new URL(apiUrl.toString())
    urlWithoutToken.searchParams.delete('token_auth')
    
    console.log('[Matomo API] Calling:', urlWithoutToken.toString())
    
    // Fetch from Matomo - send token as POST body
    const response = await fetch(urlWithoutToken.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `token_auth=${encodeURIComponent(MATOMO_TOKEN)}`
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Matomo API] Error response:', errorText)
      throw new Error(`Matomo API error: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    
    // Log the response to debug
    const dataStr = JSON.stringify(data)
    console.log('[Matomo API] Response size:', dataStr.length)
    console.log('[Matomo API] Response preview:', dataStr.substring(0, 500))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Matomo API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Matomo' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { method, params } = await request.json()
    
    // Build Matomo API URL
    const apiUrl = new URL(MATOMO_URL)
    apiUrl.searchParams.append('module', 'API')
    apiUrl.searchParams.append('method', method)
    apiUrl.searchParams.append('format', 'JSON')
    apiUrl.searchParams.append('token_auth', MATOMO_TOKEN)
    
    // Add all provided params
    Object.entries(params || {}).forEach(([key, value]) => {
      apiUrl.searchParams.append(key, String(value))
    })
    
    // Remove token from URL for POST
    const urlWithoutToken = new URL(apiUrl.toString())
    urlWithoutToken.searchParams.delete('token_auth')
    
    console.log('[Matomo API] Calling:', urlWithoutToken.toString())
    
    // Fetch from Matomo - send token as POST body
    const response = await fetch(urlWithoutToken.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `token_auth=${encodeURIComponent(MATOMO_TOKEN)}`
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Matomo API] Error response:', errorText)
      throw new Error(`Matomo API error: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    
    // Log the response to debug
    const dataStr = JSON.stringify(data)
    console.log('[Matomo API] Response size:', dataStr.length)
    console.log('[Matomo API] Response preview:', dataStr.substring(0, 500))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Matomo API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Matomo' },
      { status: 500 }
    )
  }
}
import { setSiteMappings } from './matomoClient'

// Real site mappings from Matomo
const HARDCODED_MAPPINGS: Record<string, number> = {
  // CzechAV sites
  'czechav': 16,
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
  
  // CzechGAV sites
  'czechgav': 82,
  'czechgayamateurs': 83,
  'czechgaycasting': 84,
  'czechgaycouples': 85,
  'czechgayfantasy': 86,
  'czechgaymassage': 87,
  'czechgaysolarium': 88,
  'gayhorrorporn': 56,
  
  // GoPerv sites
  'goperv': 57,
  'perversefamily': 59,
  'perversefamilylive': 60,
  'extremestreets': 55,
  'dirtysarah': 54,
  'powerfetish': 62,
  'xvirtual': 65,
  'horrorporn': 58,
  'r51': 63,
  
  // XXL sites
  'annalovesshemale': 77,
  'monstercockgang': 78,
  'redneckjohn': 79,
  'unusualpeople': 80,
  'mikebigdick': 81,
  
  // NUDZ sites
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

// Auto-initialize site mappings
export async function initializeMatomoMappings() {
  const url = process.env.NEXT_PUBLIC_MATOMO_URL
  const token = process.env.NEXT_PUBLIC_MATOMO_AUTH_TOKEN
  
  if (!url || !token) {
    console.log('[Matomo] No credentials in environment')
    return {}
  }
  
  try {
    // Use hardcoded mappings since we don't have superuser access
    setSiteMappings(HARDCODED_MAPPINGS)
    console.log(`[Matomo] Initialized with ${Object.keys(HARDCODED_MAPPINGS).length} site mappings`)
    
    // Test with a known site ID
    const testSiteId = 1 // Try site ID 1
    const apiUrl = new URL('/api/matomo', window.location.origin)
    apiUrl.searchParams.append('method', 'VisitsSummary.get')
    apiUrl.searchParams.append('idSite', testSiteId.toString())
    apiUrl.searchParams.append('period', 'month')
    apiUrl.searchParams.append('date', 'today')
    
    const response = await fetch(apiUrl.toString())
    if (!response.ok) {
      console.error('[Matomo] Failed to test API:', response.status)
      return HARDCODED_MAPPINGS
    }
    
    const data = await response.json()
    console.log('[Matomo] API test successful, visitor data accessible')
    
    return HARDCODED_MAPPINGS
  } catch (error) {
    console.error('[Matomo] Failed to initialize mappings:', error)
    return {}
  }
}
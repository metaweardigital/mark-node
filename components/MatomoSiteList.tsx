'use client'

import { useEffect, useState } from 'react'

// All sites we discovered from Matomo with their IDs
const MATOMO_SITES = {
  'CzechAV Network': {
    sites: {
      'CzechAV.com': 16,
      'CzechAmateurs.com': 15,
      'CzechBangbus.com': 17,
      'CzechBitch.com': 18,
      'CzechCabins.com': 19,
      'CzechCasting.com': 20,
      'CzechCouples.com': 21,
      'CzechDellais.com': 22,
      'CzechEstrogenolit.com': 23,
      'CzechExperiment.com': 24,
      'CzechFantasy.com': 25,
      'CzechFirstVideo.com': 26,
      'CzechGangBang.com': 27,
      'CzechGardenParty.com': 28,
      'CzechHarem.com': 29,
      'CzechHomeOrgy.com': 30,
      'CzechJacker.com': 31,
      'CzechLesbians.com': 32,
      'CzechMassage.com': 33,
      'CzechMegaSwingers.com': 34,
      'CzechOrgasm.com': 35,
      'CzechParties.com': 36,
      'CzechPawnshop.com': 37,
      'CzechPool.com': 38,
      'CzechSauna.com': 39,
      'CzechSnooper.com': 40,
      'CzechSolarium.com': 41,
      'CzechSpy.com': 42,
      'CzechStreets.com': 46,
      'CzechStudents.com': 47,
      'CzechSuperModels.com': 48,
      'CzechTantra.com': 49,
      'CzechTaxi.com': 50,
      'CzechWifeSwap.com': 51
    }
  },
  'CzechGAV Network': {
    sites: {
      'CzechGAV.com': 82,
      'CzechGayAmateurs.com': 83,
      'CzechGayCasting.com': 84,
      'CzechGayCouples.com': 85,
      'CzechGayFantasy.com': 86,
      'CzechGayMassage.com': 87,
      'CzechGaySolarium.com': 88,
      'GayHorrorPorn.com': 56
    }
  },
  'GoPerv Network': {
    sites: {
      'GOPERV': 57,
      'PerverseFamily.com': 59,
      'PerverseFamilyLive.com': 60,
      'ExtremeStreets.com': 55,
      'DirtySarah.com': 54,
      'PowerFetish.com': 62,
      'Xvirtual.com': 65,
      'HorrorPorn.com': 58,
      'R51.com': 63
    }
  },
  'XXL Network': {
    sites: {
      'AnnaLovesShemale.com': 77,
      'MonsterCockGang.com': 78,
      'RedneckJohn.com': 79,
      'UnusualPeople.com': 80,
      'MikeBigDick.com': 81
    }
  },
  'NUDZ Network': {
    sites: {
      'Nudz.com': 73,
      'GlaminoGirls.com': 69,
      'LifePornStories.com': 70,
      'UnrealPorn.com': 76,
      'CreativePorn.com': 66,
      'Spy26.com': 74,
      'MoviePorn.com': 72,
      'LoveAsmr.com': 71,
      'Ghost-Porn.com': 68,
      'FuckMeSensei.com': 67,
      'TherapyASMR.com': 75
    }
  },
  'Other Sites': {
    sites: {
      'FreeVideo.cz': 1,
      'FreeVideo.cz - zahraniční traffic': 2,
      'Glamino': 5,
      'Xfree.com': 9,
      'Pornsitesall': 10,
      'SeeMyFetish': 11,
      'Club BDSM': 52,
      'Selfie Fetish': 64
    }
  }
}

export function MatomoSiteList() {
  const [selectedSite, setSelectedSite] = useState<{name: string, id: number} | null>(null)
  const [visitorData, setVisitorData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchSiteData = async (siteId: number, siteName: string) => {
    setLoading(true)
    setSelectedSite({name: siteName, id: siteId})
    
    try {
      const response = await fetch(`/api/matomo?method=VisitsSummary.get&idSite=${siteId}&period=month&date=today`)
      const data = await response.json()
      setVisitorData(data)
    } catch (error) {
      console.error('Failed to fetch site data:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto z-50">
      <h2 className="text-xl font-bold mb-4">Matomo Sites Directory</h2>
      
      {selectedSite && visitorData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold">{selectedSite.name}</h3>
          <div className="text-sm mt-2 space-y-1">
            <div>Visitors: {visitorData.nb_uniq_visitors?.toLocaleString() || 0}</div>
            <div>Visits: {visitorData.nb_visits?.toLocaleString() || 0}</div>
            <div>Bounce: {visitorData.bounce_rate?.toFixed(1) || 0}%</div>
            <div>Avg Time: {Math.round((visitorData.avg_time_on_site || 0) / 60)}min</div>
          </div>
        </div>
      )}
      
      {Object.entries(MATOMO_SITES).map(([network, data]) => (
        <div key={network} className="mb-6">
          <h3 className="font-bold text-sm text-gray-700 mb-2">{network} ({Object.keys(data.sites).length} sites)</h3>
          <div className="space-y-1">
            {Object.entries(data.sites).map(([siteName, siteId]) => (
              <button
                key={siteId}
                onClick={() => fetchSiteData(siteId, siteName)}
                className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                  selectedSite?.id === siteId ? 'bg-blue-100 font-medium' : ''
                }`}
                disabled={loading}
              >
                {siteName} <span className="text-xs text-gray-500">(#{siteId})</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
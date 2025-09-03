# Network Structure - Matomo & Business Mapping

## 🎯 Our 5 Networks (67 Sites Total)

### 1. CzechAV Network (34 sites)
- **Network ID**: czechav
- **Main Site**: CzechAV.com (#16)
- **Pricing**: $39.90/month for all sites
- **Key Sites**: CzechCasting (#20), CzechMassage (#33), CzechTaxi (#50)

### 2. CzechGAV Network (8 sites)  
- **Network ID**: czechgav
- **Main Site**: CzechGAV.com (#82)
- **Pricing**: $29.99/month for all sites
- **Key Sites**: CzechGayMassage (#87), GayHorrorPorn (#56)

### 3. GoPerv Network (9 sites)
- **Network ID**: goperv
- **Main Site**: GOPERV (#57)
- **Pricing**: $19.99/month for all sites
- **Key Sites**: PerverseFamily (#59), HorrorPorn (#58), ExtremeStreets (#55)

### 4. XXL Network (5 sites)
- **Network ID**: xxl
- **Main Site**: MonsterCockGang (#78)
- **Pricing**: $19.99/month for all sites
- **Key Sites**: UnusualPeople (#80), RedneckJohn (#79)

### 5. NUDZ Network (11 sites)
- **Network ID**: nudz
- **Main Site**: Nudz.com (#73)
- **Pricing**: $19.99/month for all sites
- **Key Sites**: CreativePorn (#66), TherapyASMR (#75), Ghost-Porn (#68)

## 📊 Traffic Source Filtering

### "All Sites" Selection
- Aggregates data from all 67 sites across 5 networks
- Excludes non-network sites (FreeVideo.cz, etc.)

### Network Selection
- Shows aggregated data for all sites in that network
- Example: CzechAV shows combined metrics for 34 sites

### Individual Site Selection
- Shows metrics for single site only
- Direct connection to Matomo site ID

## ✅ What's Working Now

1. **Real visitor data** from Matomo API
2. **Proper network grouping** (5 networks, 67 sites)
3. **Dynamic filtering** in flow node
4. **Bulk API calls** for performance
5. **Excludes non-network sites** from "All" view

## 🔧 Data Flow

```
Traffic Source Node (Filter)
         ↓
   Determines which sites
         ↓
Fetches from Matomo API (bulk)
         ↓
  Aggregates if multiple
         ↓
Updates visitor count in flow
         ↓
  Recalculates revenue
```
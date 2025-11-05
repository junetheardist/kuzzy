# 🗺️ Map Indicators Reference Guide

## Overview
The GoogleMapView component displays **3 types of indicators** on the map depending on the current tab and location data.

---

## 📍 Indicator Types

### 1. **Current Location Marker** (ALWAYS VISIBLE)
```
Visual:
  🔵 Blue circle with white border
  
Specifications:
  - Shape: Circle
  - Color: Blue (#4285F4)
  - Border: White, 3px
  - Size: 20px diameter
  - Shadow: Yes (drop shadow)
  - Location: User's GPS location
  
When Visible:
  ✓ Always visible on map
  ✓ Appears if browser geolocation enabled
  ✓ Shows user's current position
  
Label: "You are here"
```

**Code:**
```tsx
const CurrentLocationMarker = ({text}: { text: string, lat: number, lng: number }) => (
    <div style={{position: 'relative'}}>
        <div
            style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#4285F4',
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)'
            }}
        />
    </div>
);
```

---

### 2. **Store Markers** (VISIBLE IN STORES TAB)
```
Visual:
  📍 Indigo pin shape with store icon
  
Specifications:
  - Shape: Pin (45° rotation)
  - Color: Indigo (#4F46E5)
  - Border: White, 2px
  - Size: 32px × 40px
  - Icon: Store symbol (white, centered)
  - Shadow: Yes (drop shadow)
  - Location: Vendor store coordinates
  
When Visible:
  ✓ Only when activeTab === 'stores'
  ✓ Requires valid shopAddress with latitude/longitude
  ✓ One marker per vendor store
  
Hover Behavior:
  - Shows store name in tooltip
  - Changes cursor to pointer
```

**Code:**
```tsx
const StoreMarker = ({text, shopName}: { text: string, shopName?: string, lat: number, lng: number }) => (
    <div style={{position: 'relative', cursor: 'pointer'}} title={shopName}>
        <div style={{
            width: '32px',
            height: '40px',
            backgroundColor: '#4F46E5',
            borderRadius: '50% 50% 50% 0%',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transform: 'rotate(-45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '-16px',
            marginTop: '-20px'
        }}>
            <Store 
                size={16} 
                color="white" 
                style={{
                    transform: 'rotate(45deg)',
                }}
            />
        </div>
    </div>
);
```

---

### 3. **Default Markers** (VISIBLE IN OTHER TABS)
```
Visual:
  🧭 Cap/pin image icon
  
Specifications:
  - Type: Image marker
  - Source: /cap.png
  - Size: 30px × 30px
  - Cursor: pointer
  - Count: 3 hardcoded markers
  
When Visible:
  ✓ Only when activeTab !== 'stores'
  ✓ Hidden when Store Markers are displayed
  ✓ Provides default map reference points
  
Marker Locations (Hardcoded):
  1. Lagos Center: lat 6.5244, lng 3.3792
  2. Marker 2:    lat 6.6,    lng 3.5
  3. Marker 3:    lat 6.45,   lng 3.3
```

**Code:**
```tsx
const Marker = ({text}: { text: string, lat: number, lng: number }) => (
    <div style={{position: 'relative'}}>
        <img
            src="/cap.png"
            alt={text}
            style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)'
            }}
        />
    </div>
);

const markerData = [
    {lng: 3.3792, lat: 6.5244, title: "Lagos Center"},
    {lng: 3.5, lat: 6.6, title: "Marker 2"},
    {lng: 3.3, lat: 6.45, title: "Marker 3"}
];
```

---

## 🔄 Indicator Display Logic

### **When activeTab === 'stores'**
```
Map Shows:
├─ ✅ Current Location Marker (blue circle)
├─ ✅ Store Markers (indigo pins with store icon)
└─ ❌ Default Markers (hidden)

Rendering Code:
{currentLocation && <CurrentLocationMarker ... />}
{showStores && stores.map((store) => <StoreMarker ... />)}
{!showStores && markerData.map((marker) => <Marker ... />)}
```

### **When activeTab !== 'stores' (Orders, Locations, etc)**
```
Map Shows:
├─ ✅ Current Location Marker (blue circle)
├─ ❌ Store Markers (hidden)
└─ ✅ Default Markers (3 cap icons)

Rendering Code:
{currentLocation && <CurrentLocationMarker ... />}
{!showStores && markerData.map((marker) => <Marker ... />)}
```

---

## 🎨 Visual Comparison

### Store Marker (Indigo Pin)
```
         🔺
        / \
       /   \
      |  🏪 |  ← Store icon
       \   /
        \_/
      
Color: Indigo (#4F46E5)
Border: White
Icon: Store (Lucide React)
Rotation: -45° (pin points down-left)
```

### Current Location Marker (Blue Circle)
```
       ⭕
      ║   ║
      ║ 🟦 ║  ← Blue center
      ║   ║
       ⭕
      
Color: Blue (#4285F4)
Border: White (3px)
Shape: Circle
Radius: 10px
```

### Default Marker (Cap Icon)
```
       🧭
      
Image: /cap.png (30×30px)
Cursor: pointer
Type: PNG image
```

---

## 📊 Marker Data Sources

| Marker Type | Data Source | Availability | Count |
|------------|------------|--------------|-------|
| Current Location | Browser Geolocation API | Conditional | 1 (if available) |
| Store Markers | Redux `stores` prop | Stores tab only | Dynamic (per vendor) |
| Default Markers | Hardcoded array | Non-store tabs | 3 (fixed) |

---

## 🚀 Map Controls (Always Available)

```
Features:
├─ Zoom Control: +/- buttons
├─ Pan: Click and drag
├─ Fullscreen Control: Expand to full screen
├─ Street View: See street-level view
└─ Map Type Selector: Switch map types
```

---

## 💡 Key Points

### Current Location Marker
- 🔵 Always tries to appear (if geolocation enabled)
- Gets user's GPS coordinates
- Falls back to default location (Lagos: 6.5244, 3.3792) if geolocation denied
- Shows "You are here" tooltip

### Store Markers
- 📍 Only visible in Stores tab (`activeTab === 'stores'`)
- Gets from Redux `stores` prop (vendor array)
- Requires `shopAddress` object with `latitude` and `longitude`
- Shows store name on hover
- Indigo color matches app design system

### Default Markers
- 🧭 Backup markers for non-store tabs
- 3 hardcoded locations around Lagos
- Uses cap.png image from public folder
- Hidden when viewing stores

---

## 🔧 Props Passed to GoogleMapView

From `app/page.tsx`:
```tsx
<GoogleMapView 
  showStores={activeTab === 'stores'}    // Controls marker visibility
  stores={vendors}                        // Array of vendor stores
/>
```

---

## 📌 Integration Points

### Redux Integration
```
Redux State:
  └─ vendors (vendor array from fetchVendors)
    └─ Each vendor has:
      ├─ _id
      ├─ shopName
      └─ shopAddress
        ├─ latitude
        ├─ longitude
        ├─ street
        ├─ city
        ├─ state
        └─ country

Map Component:
  └─ Receives: stores prop
    └─ Loops through each store
      └─ Renders: StoreMarker with coordinates
```

### Browser Geolocation Integration
```
Browser Request:
  └─ navigator.geolocation.getCurrentPosition()
    ├─ Success: Sets currentLocation state
    └─ Error: Silently fails (uses default location)

Result:
  └─ CurrentLocationMarker renders at user's position
```

---

## 🐛 Troubleshooting

### Store Markers Not Showing
```
Check:
1. ✓ activeTab === 'stores' ? (is it set correctly?)
2. ✓ vendors array populated from Redux? (API call succeeded?)
3. ✓ shopAddress exists on vendor? (non-null object?)
4. ✓ latitude & longitude valid numbers? (not null/undefined?)
5. ✓ console shows no errors? (check DevTools)

Common Issue: shopAddress might be string instead of object
Fix: Type check in component (already implemented)
```

### Current Location Not Showing
```
Check:
1. ✓ Geolocation enabled in browser?
2. ✓ HTTPS connection? (geolocation requires HTTPS in production)
3. ✓ Permission granted? (browser may prompt user)
4. ✓ GPS coordinates valid? (check console logs)

If all fail: Map shows default location (Lagos)
```

### Default Markers Not Showing
```
Check:
1. ✓ Is activeTab 'stores'? (default markers hidden when true)
2. ✓ /cap.png exists in public folder?
3. ✓ Image path correct? (should be '/cap.png')
4. ✓ CORS/permissions? (usually not an issue for public folder)
```

---

## 🎯 Summary

### Three-Tier Indicator System:

**Tier 1: Current Location (Always)**
- Blue circle showing "You are here"
- User's GPS position

**Tier 2: Primary Indicator (Tab-Based)**
- Stores Tab: Indigo store pins (vendor locations)
- Other Tabs: Cap icons (default reference points)

**Tier 3: Context**
- Store names on hover
- Map controls for navigation
- Auto-centering on location

---

**Last Updated**: November 2, 2025
**Component**: `GoogleMapView.tsx`
**Status**: ✅ Production Ready

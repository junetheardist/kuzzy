# 🗺️ Map Controls - Enhanced Navigation & Repositioning

## Overview
The GoogleMapView component now includes **advanced map controls** for full control over map positioning, zooming, and navigation.

---

## 🎮 Available Controls

### **1. 📍 Center on Location** (Indigo Button - Bottom Right)
```
Visual:
  🧭 Navigation icon (indigo button)
  
Function:
  - Centers map on your current GPS location
  - Automatically sets zoom to 15
  - Disabled if geolocation not available
  
When to Use:
  ✓ You've panned away from your location
  ✓ Want quick return to "You are here"
  ✓ Quick navigation back to starting point
  
Behavior:
  - Smooth animation to location
  - Disabled state (gray) if no location
  - Enabled (indigo) when location available
```

### **2. ➕ Zoom In** (White Button)
```
Visual:
  + Plus icon (white button)
  
Function:
  - Increases map zoom level by 1
  - Max zoom: 21
  - Smooth zoom animation
  
When to Use:
  ✓ See details of stores/markers
  ✓ Get closer look at specific area
  ✓ Examine neighborhood
  
Behavior:
  - Can be clicked repeatedly
  - Stops at zoom level 21 (max)
  - Instant response
```

### **3. ➖ Zoom Out** (White Button)
```
Visual:
  - Minus icon (white button)
  
Function:
  - Decreases map zoom level by 1
  - Min zoom: 1
  - Smooth zoom animation
  
When to Use:
  ✓ See broader area
  ✓ Overview of multiple locations
  ✓ Context/distance between points
  
Behavior:
  - Can be clicked repeatedly
  - Stops at zoom level 1 (min)
  - Instant response
```

### **4. 🔄 Reset Location** (White Button)
```
Visual:
  ↻ Rotate/reset icon (white button)
  
Function:
  - Resets to default location (Lagos Center)
  - Resets zoom to 15
  - Clears any custom positioning
  
When to Use:
  ✓ Lost track of location
  ✓ Start fresh navigation
  ✓ Return to default view
  
Behavior:
  - One-click reset
  - Always available (never disabled)
  - Returns to: lat 6.5244, lng 3.3792
```

### **5. 📊 Zoom Level Display** (Bottom Left)
```
Visual:
  Small box showing current zoom level
  
Information:
  - Displays current zoom: "Zoom: 15"
  - Updates when you zoom
  - Real-time feedback
  
When to Use:
  ✓ Reference current magnification
  ✓ Track zoom changes
  ✓ Plan zoom adjustments
```

---

## 🎯 Control Panel Layout

```
┌─────────────────────────────────┐
│                                 │
│         GOOGLE MAP              │
│                                 │
│                          ┌────┐ │
│                          │ 🧭 │ │ ← Center on Location (Indigo)
│                          ├────┤ │
│                          │ +  │ │ ← Zoom In (White)
│                          ├────┤ │
│                          │ -  │ │ ← Zoom Out (White)
│                          ├────┤ │
│                          │ ↻  │ │ ← Reset Location (White)
│                          └────┘ │
│                                 │
│ ┌─────────────┐                 │
│ │ Zoom: 15    │                 │ ← Zoom Display (Bottom Left)
│ └─────────────┘                 │
│                                 │
└─────────────────────────────────┘
```

---

## 💾 State Management

### Map Center State
```typescript
const [mapCenter, setMapCenter] = useState({
    lat: 6.5244,
    lng: 3.3792
});
```
- Default: Lagos Center
- Updated on: Location button click, Reset button
- Type: `{lat: number, lng: number}`

### Zoom State
```typescript
const [zoom, setZoom] = useState(15);
```
- Default: 15 (neighborhood level)
- Range: 1 (world) to 21 (street level)
- Updated on: +/- buttons, Reset button, Location button

### Location State
```typescript
const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
```
- Set on: Browser geolocation success
- Used for: Center on Location button
- Nullable: Can be null if geolocation fails

---

## 🔧 Handler Functions

### `handleCenterOnLocation()`
```typescript
const handleCenterOnLocation = () => {
    if (currentLocation) {
        setMapCenter(currentLocation);
        setZoom(15);
    }
};
```
- ✓ Validates current location exists
- ✓ Sets map center to current location
- ✓ Sets zoom to 15 (optimal neighborhood view)
- ✓ Smooth animation

### `handleZoomIn()`
```typescript
const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 21));
};
```
- ✓ Increments zoom by 1
- ✓ Prevents zoom > 21
- ✓ Can be clicked repeatedly

### `handleZoomOut()`
```typescript
const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
};
```
- ✓ Decrements zoom by 1
- ✓ Prevents zoom < 1
- ✓ Can be clicked repeatedly

### `handleResetLocation()`
```typescript
const handleResetLocation = () => {
    setMapCenter({
        lat: 6.5244,
        lng: 3.3792
    });
    setZoom(15);
};
```
- ✓ Resets to default location (Lagos)
- ✓ Resets zoom to 15
- ✓ Always available

---

## 🎨 Button Styling

### Center on Location Button
```tsx
<button
    onClick={handleCenterOnLocation}
    disabled={!currentLocation}
    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 
               disabled:cursor-not-allowed text-white p-3 rounded-lg shadow-lg 
               transition-all duration-200 flex items-center justify-center"
>
```
- **Color**: Indigo (#4F46E5)
- **Hover**: Darker indigo
- **Disabled**: Gray (#D1D5DB)
- **Size**: 3 units padding (44px)
- **Icon**: Navigation (20px)

### Zoom & Reset Buttons
```tsx
<button
    onClick={handleZoomIn}
    className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg 
               shadow-lg transition-all duration-200 flex items-center justify-center 
               border border-gray-200"
>
```
- **Color**: White
- **Hover**: Light gray
- **Border**: Light gray (#E5E7EB)
- **Size**: 3 units padding (44px)
- **Icons**: Plus, Minus, Rotate (20px)

---

## 📍 Control Positioning

### Bottom Right (Action Controls)
```css
position: absolute;
bottom: 1.5rem;    /* 24px from bottom */
right: 1.5rem;     /* 24px from right */
z-index: 20;
display: flex;
flex-direction: column;
gap: 0.5rem;       /* 8px between buttons */
```

### Bottom Left (Zoom Display)
```css
position: absolute;
bottom: 1.5rem;    /* 24px from bottom */
left: 1.5rem;      /* 24px from left */
z-index: 20;
background: white;
padding: 0.5rem 0.75rem;
border-radius: 0.5rem;
box-shadow: 0 10px 15px rgba(0,0,0,0.1);
```

---

## 🔄 Interaction Flow

### User Journey 1: Center on Location
```
User clicks 🧭 button
    ↓
Component checks: currentLocation != null?
    ↓ YES
setMapCenter(currentLocation)
setZoom(15)
    ↓
Map animates to user's location
    ↓
User sees map centered on 🔵 (blue circle)
```

### User Journey 2: Zoom In Detail
```
User clicks + button
    ↓
Current zoom = 14
    ↓
handleZoomIn() called
    ↓
setZoom(Math.min(14 + 1, 21))
setZoom(15)
    ↓
Map smoothly zooms in
    ↓
Zoom display shows "Zoom: 15"
```

### User Journey 3: Get Lost?
```
User pans around, zooms multiple times
    ↓
User clicks ↻ button
    ↓
Map resets to Lagos Center
    ↓
Zoom resets to 15
    ↓
All controls available again
```

---

## 📊 Zoom Levels Reference

| Zoom | View | Use Case |
|------|------|----------|
| 1-4 | World/Continent | World overview |
| 5-8 | Country/Region | Regional view |
| 9-12 | City | City overview |
| 13-15 | Neighborhood | Store browsing |
| 16-18 | Street | Street-level detail |
| 19-21 | Building | Building detail |

**Default**: 15 (Neighborhood - optimal for store viewing)

---

## 🔒 Disabled States

### Center on Location Button
```
DISABLED when:
  ✓ currentLocation === null
  ✓ Geolocation not available
  ✓ Browser permission denied
  
ENABLED when:
  ✓ currentLocation has {lat, lng}
  ✓ Geolocation permission granted
  ✓ GPS coordinates valid
```

### Other Buttons
```
NEVER DISABLED:
  ✓ Zoom In (can always increase until 21)
  ✓ Zoom Out (can always decrease until 1)
  ✓ Reset Location (always available)
```

---

## 🚀 Features

### ✨ Smooth Animations
- Zoom changes animate smoothly
- Map center transitions smoothly
- Professional feel

### ♿ Accessibility
- Large touch targets (44×44px minimum)
- Clear visual feedback
- Hover states for desktop users
- Tooltips on all buttons

### 📱 Responsive
- Controls scale on mobile
- Touch-friendly button sizes
- Bottom right positioning (thumb-friendly)

### 🎯 User-Centric
- One-click back to location
- Visual zoom level feedback
- Reset option for confusion
- Intuitive button placement

---

## 💡 Usage Examples

### Example 1: User pans away
```
Scenario:
  User exploring map, clicks and drags
  Map moves away from current location
  User wants to return quickly

Solution:
  Click 🧭 (Center on Location)
  → Map instantly centers on user
  → Zoom sets to 15
  → Perfect for browsing
```

### Example 2: Looking for details
```
Scenario:
  Viewing store locations (zoom 15)
  Wants to see which stores nearby
  Need to see more detail

Solution:
  Click + (Zoom In) 2-3 times
  → Zoom becomes 17-18
  → See street-level detail
  → Identify nearby stores
```

### Example 3: Overview map
```
Scenario:
  Confused after multiple interactions
  Zoomed in, panned around
  Wants fresh start

Solution:
  Click ↻ (Reset Location)
  → Back to Lagos Center
  → Zoom to 15
  → Start fresh
```

---

## 🧪 Testing Checklist

- [ ] Click 🧭 button → map centers on blue circle
- [ ] Click + button → zoom increases by 1
- [ ] Click - button → zoom decreases by 1
- [ ] Click ↻ button → map resets to Lagos
- [ ] Check zoom display → shows current level
- [ ] 🧭 button disabled if no geolocation
- [ ] All buttons responsive to clicks
- [ ] Buttons don't overlap map controls
- [ ] Smooth animations when changing view
- [ ] Touch-friendly on mobile

---

## 🎯 Summary

**4 Action Buttons + 1 Info Display**

| Control | Icon | Position | Function |
|---------|------|----------|----------|
| Center Location | 🧭 | Bottom Right | Go to current GPS |
| Zoom In | + | Bottom Right | Increase zoom |
| Zoom Out | - | Bottom Right | Decrease zoom |
| Reset | ↻ | Bottom Right | Return to default |
| Zoom Info | Text | Bottom Left | Display zoom level |

**Benefits:**
✅ Full map control
✅ Easy navigation
✅ Quick orientation
✅ Professional UI
✅ Mobile-friendly

---

**Last Updated**: November 2, 2025
**Component**: `GoogleMapView.tsx`
**Status**: ✅ Production Ready

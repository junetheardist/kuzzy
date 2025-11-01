# AddStoreForm User Experience Guide

## Visual Feedback During Form Submission

### State 1: Form Ready (Initial State)
```
┌─────────────────────────────────────────────┐
│  Store Info | Owner Info | ... (tabs)       │
├─────────────────────────────────────────────┤
│  Profile Completion: 30%                    │
│  [████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]    │
├─────────────────────────────────────────────┤
│  Store Name *                               │
│  [________________]                         │
│  Store Email Address                        │
│  [________________]                         │
│  ... more fields                            │
├─────────────────────────────────────────────┤
│                    [Cancel] [Save] ✓        │
└─────────────────────────────────────────────┘
```
- All buttons are **enabled**
- Form accepts input
- Progress bar updates as user fills fields

---

### State 2: Validation Error (Before Submission)
```
┌─────────────────────────────────────────────┐
│  🔴 Store name is required                  │  ← Alert appears
├─────────────────────────────────────────────┤
│  Store Info | Owner Info | ... (tabs)       │
├─────────────────────────────────────────────┤
│  Profile Completion: 0%                     │
│  [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │
├─────────────────────────────────────────────┤
│  Store Name * (required field)              │
│  [________________] ❌ error indicator      │
│                    ❌ Store name is required│
│  Store Email Address                        │
│  [________________]                         │
├─────────────────────────────────────────────┤
│                    [Cancel] [Save] ✓        │
└─────────────────────────────────────────────┘
```
- Error message appears in **red alert box**
- Individual field shows **error state**
- Save button remains **enabled** (allows retry)

---

### State 3: Submission In Progress
```
┌─────────────────────────────────────────────┐
│  ✅ All fields valid                        │  ← Success indicator
├─────────────────────────────────────────────┤
│  Store Info | Owner Info | ... (tabs)       │
├─────────────────────────────────────────────┤
│  Profile Completion: 100%                   │
│  [████████████████████████████████████████] │
├─────────────────────────────────────────────┤
│  ... form fields (disabled/grayed out)      │
├─────────────────────────────────────────────┤
│              [Cancel] [Saving...] ⏳        │
│              disabled  disabled             │
│              opaque    spinning             │
└─────────────────────────────────────────────┘
```
- Save button shows **"Saving..."** label
- Both buttons are **disabled** (prevents double-submit)
- Form input becomes **read-only/disabled** visually
- **Spinner/loading indicator** appears on button

---

### State 4: Success State (After Submission)
```
┌─────────────────────────────────────────────┐
│  ✅ Vendor profile created successfully!    │  ← Green success
├─────────────────────────────────────────────┤
│  Store Info | Owner Info | ... (tabs)       │
├─────────────────────────────────────────────┤
│  ... form fields                            │
├─────────────────────────────────────────────┤
│              [Cancel] [Saved!] ✓            │
│              enabled  disabled              │
└─────────────────────────────────────────────┘
(Automatically closes in 2 seconds)
```
- Green alert box shows **success message**
- Save button shows **"Saved!"** label
- Form **automatically closes** after 2 seconds
- Vendor list **refreshes** in background

---

### State 5: API Error State
```
┌─────────────────────────────────────────────┐
│  ❌ User not found                          │  ← Red error
├─────────────────────────────────────────────┤
│  Store Info | Owner Info | ... (tabs)       │
├─────────────────────────────────────────────┤
│  ... form fields (re-enabled)               │
├─────────────────────────────────────────────┤
│              [Cancel] [Save] ✓              │
│              enabled  enabled               │
└─────────────────────────────────────────────┘
```
- Red alert box with **specific error message**
- Form **remains open** for user to fix
- Buttons are **re-enabled**
- User can **edit and retry**

---

## Data Flow Diagram

```
┌─────────────────────────────┐
│   User Clicks Save Button   │
└──────────────┬──────────────┘
               ↓
    ┌──────────────────────┐
    │ Check Required       │
    │ Fields (Client)      │
    └──────────┬───────────┘
               ↓
        ┌──────────────┐
        │ Valid? ✓     │
        └──────┬───────┘
               │
        ┌──────▼──────────────────────┐
        │ Transform Form Data          │
        │ to API Schema                │
        └──────┬──────────────────────┘
               ↓
        ┌──────────────────────┐
        │ POST /api/vendor/    │
        │ create (setLoading)  │
        └──────┬───────────────┘
               ↓
        ┌──────────────┐
        │ API Response │
        └──────┬───────┘
           ┌───┴────┐
        ✅ │        │ ❌
           ↓        ↓
      ┌────────┐  ┌──────────┐
      │Success │  │Error     │
      │(201)   │  │(4xx/5xx) │
      └────┬───┘  └────┬─────┘
           ↓           ↓
      ┌─────────┐  ┌──────────┐
      │Show     │  │Display   │
      │Success  │  │Error Msg │
      │Message  │  │& Re-open │
      └────┬────┘  └──────────┘
           ↓
      ┌──────────┐
      │Refresh   │
      │Vendor    │
      │List      │
      └────┬─────┘
           ↓
      ┌──────────┐
      │Close     │
      │Form      │
      │(2 sec)   │
      └──────────┘
```

---

## Error Messages Reference

| Scenario | Message | Type | Action |
|----------|---------|------|--------|
| Not logged in | "User ID is required. Please log in again." | Alert | Redirect to login |
| Missing store name | "Store name is required" | Alert + Field | Fill field |
| Missing shop address | "Shop address is required" | Alert + Field | Fill field |
| Missing owner name | "Owner name is required" | Alert + Field | Fill field |
| API: User not found | "User not found" | Alert | Re-login |
| API: Email invalid | "Invalid shop email format" | Alert | Fix email |
| API: Generic error | "Failed to add vendor. Please try again." | Alert | Retry |

---

## Button States Timeline

```
Initial       → Filling Form    → Ready to Save   → Submitting
┌─────────┐   ┌─────────┐      ┌──────────┐      ┌──────────┐
│ [Cancel]│   │ [Cancel]│      │ [Cancel] │      │[Cancel]  │
│ [Save]  │   │ [Save]  │      │ [Save]   │      │[Saving...]
└─────────┘   └─────────┘      └──────────┘      │(disabled)│
enabled       enabled          enabled           └──────────┘
                                                  disabled

          ↓                                              ↓

        ✅ Success                                    ❌ Error
        ┌──────────┐                               ┌──────────┐
        │ [Cancel] │                               │ [Cancel] │
        │ [Saved!] │                               │ [Save]   │
        │(disabled)│                               │(enabled) │
        └──────────┘                               └──────────┘
                    (auto-closes in 2s)
```

---

## Validation Rules

### Real-Time Validation (onChange)
- Errors show/hide as user types
- Red outline on invalid fields
- Error message displays below field
- User gets immediate feedback

### Pre-Submission Validation
1. **Required Field Check** (in onSubmit)
   - storeName required
   - shopAddress required
   - ownerName required

2. **User Context Check** (in onSubmit)
   - userId must exist in Redux auth state

3. **API Validation** (backend)
   - Email format validation
   - User existence check
   - User verification status
   - Vendor duplication check

---

## Loading Indicators

### Button Loading State
- Text changes: "Save" → "Saving..." → "Saved!"
- Opacity decreases: `opacity-70`
- Cursor changes: `cursor-wait`
- Disabled state: `disabled={isLoading || success}`

### Form Behavior During Load
- All inputs remain visible but disabled
- Form scrolls are possible
- User can see what was submitted

### Cancel Button During Load
- Disabled during submission
- Remains enabled if error occurs
- Prevents orphaned submissions

# Edit Store Feature - Visual Guide & Implementation Details

## User Interface Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Store List (Grid or Compact View)                          │
│  [Store Card 1] [Store Card 2] [Store Card 3]               │
└─────────────────────────────────────────────────────────────┘
                        │
                   Click on card
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  Store Details Modal                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Store Name        [🖊️ Edit] [✕ Close]                 │ │
│  │ Category                                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ [Store Details Tab] [Products Tab]                    │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  Status: Active                                        │ │
│  │  Cover Image                                           │ │
│  │  Shop Details (Email, Phone, Sales Type)              │ │
│  │  Shop Address (Street, City, State, etc.)             │ │
│  │  Owner Details (Name, Email, Phone)                   │ │
│  │  Business Registration                                │ │
│  │  Metadata (Date Joined, Store ID)                     │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                        │
                  Click Edit button
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  Edit Store Modal                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Edit Store: Store Name         [✕ Close]              │ │
│  │ Update store information and details                   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Profile Completion: 75%                                │ │
│  │ [████████████░░] Progress Bar                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ [Store Info] [Owner Info] [Certification] [Gallery]   │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  Store Name: [________________]                        │ │
│  │  Store Email: [________________]                       │ │
│  │  Primary Phone: [________] Secondary: [________]       │ │
│  │  Sales Type: [Dropdown: Retail/Wholesale/Both]        │ │
│  │                                                        │ │
│  │  Shop Address                                          │ │
│  │  Search: [__________________] [📍 Generate Location]  │ │
│  │  Street: [________________]  City: [________________]  │ │
│  │  State: [________________]   Country: [________________]│ │
│  │  Postal Code: [________________]                       │ │
│  │  Coordinates: Lat [________] Lng [________]            │ │
│  │                                                        │ │
│  │ [Info messages / Success / Error alerts]              │ │
│  │                                                        │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                          [Next] [Save Changes]         │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                        │
                 Save Changes (Step 4)
                        │
                        ▼
        ✅ Success message appears
        📡 API updates store data
        🔄 Modals close
        🔄 Store list refreshes
```

## Component Architecture

```
StoreList
├── useState(selectedStore)
├── useState(editingStore)
│
├── StoreDetailsModal
│   ├── Props:
│   │   ├── store: Vendor
│   │   ├── isOpen: boolean
│   │   ├── onClose: () => void
│   │   └── onEdit: (store: Vendor) => void  [NEW]
│   │
│   └── Renders:
│       ├── Header with Edit Button [NEW]
│       ├── Tab Navigation (Details | Products)
│       ├── Details Tab Content
│       └── Products Tab Table
│
└── EditStoreModal [NEW]
    ├── Props:
    │   ├── store: Vendor
    │   ├── isOpen: boolean
    │   └── onClose: () => void
    │
    └── Renders:
        ├── Header
        └── EditStoreForm
            ├── Props:
            │   ├── store: Vendor
            │   └── onClose: () => void
            │
            └── Features:
                ├── 4-Step Form Navigation
                ├── Progress Indicator
                ├── Form Step Components:
                │   ├── StoreInfoStep
                │   ├── OwnerInfoStep
                │   ├── CertificationStep
                │   └── GalleryStep
                ├── Validation & Errors
                ├── Redux updateVendor Action
                └── Success/Error Messaging
```

## State Flow Diagram

```
Initial State:
  selectedStore = null
  editingStore = null

User Action: Click Store Card
  ↓
  selectedStore = {store data}
  StoreDetailsModal opens

User Action: Click Edit Button
  ↓
  onEdit callback triggered
  editingStore = {store data}
  selectedStore = null
  StoreDetailsModal closes
  EditStoreModal opens

User Action: Edit & Save
  ↓
  updateVendor API call
  Success: editingStore = null
  fetchVendors refreshes list
  Both modals close
  Store List updates

OR

User Action: Click Close (X) button
  ↓
  editingStore = null
  EditStoreModal closes
  User returns to store list
```

## Data Flow for Edit

```
Store Data (Redux):
  store = {
    _id: "store123",
    shopName: "My Store",
    shopEmail: "store@example.com",
    shopPrimaryPhoneNumber: "123456789",
    shopSecondaryPhoneNumber: "987654321",
    saleType: "retail",
    shopAddress: {
      street: "123 Main St",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "100001",
      latitude: 6.5244,
      longitude: 3.3792
    },
    ownerName: "John Doe",
    ownerEmail: "john@example.com",
    ownerPrimaryPhoneNumber: "111111111",
    ownerSecondaryPhoneNumber: "222222222",
    ownerAddress: {
      street: "45 Oak Ave",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria"
    },
    officialBusinessName: "JD Enterprises",
    cacNumber: "BN123456",
    cacDocFile: "",
    gallery: { coverImageUrl: "...", otherImagesUrl: [...] },
    status: "active",
    category: "Electronics",
    dateJoined: "2024-01-15",
    registrationDocuments: {...}
  }

Form Pre-fill (EditStoreForm defaultValues):
  {
    storeName: "My Store",
    storeEmail: "store@example.com",
    storePrimaryPhone: "123456789",
    storeSecondaryPhone: "987654321",
    saleType: "retail",
    shopAddress: {
      street: "123 Main St",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "100001",
      latitude: 6.5244,
      longitude: 3.3792
    },
    ownerName: "John Doe",
    ownerEmail: "john@example.com",
    ownerPrimaryPhone: "111111111",
    ownerSecondaryPhone: "222222222",
    ownerAddress: {
      street: "45 Oak Ave",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria"
    },
    officialBusinessName: "JD Enterprises",
    cacNumber: "BN123456",
    cacDocFile: "",
    gallery: {...}
  }

Form Submission:
  User clicks "Save Changes"
  ↓
  validate required fields
  ↓
  Build updateData object:
  {
    _id: "store123",
    shopName: "Updated Store Name",
    shopAddress: {...updated},
    shopEmail: "newemail@example.com",
    ... (all changed fields)
  }
  ↓
  dispatch(updateVendor(updateData))
  ↓
  API PUT /api/vendor
  ↓
  Response: updated vendor
  ↓
  Success message
  ↓
  dispatch(fetchVendors())  // Refresh list
  ↓
  Modal closes
  ↓
  Store List re-renders with updated data
```

## Button Styles & Icons

### Edit Button (In Store Details Modal Header)
```tsx
// Location: Header right, before close button
// Icon: Lucide React Edit icon
// Colors: Indigo (primary brand color)
// States:
//   - Normal: Indigo text, transparent background
//   - Hover: Indigo text, light indigo background
//   - Active: Indigo text on click

className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 transition-colors"
```

### Save Changes Button (In Edit Form)
```tsx
// Location: Form footer, bottom right
// States:
//   - Normal: "Save Changes" (enabled)
//   - Loading: "Saving..." (disabled, lower opacity)
//   - Success: "Saved!" (disabled briefly)

className={isLoading ? 'opacity-70 cursor-wait' : ''}
```

## Form Steps Detail

### Step 1: Store Info
```
Fields:
  - Store Name * (required)
  - Store Email Address
  - Primary Phone
  - Secondary Phone
  - Sales Type * (required, dropdown: Retail/Wholesale/Both)
  - Shop Address Section:
    - Search Address [with Generate Location button]
    - Street * (required)
    - City * (required)
    - State * (required)
    - Country * (required)
    - Postal Code * (required)
    - Latitude (auto-filled)
    - Longitude (auto-filled)

Validation:
  - storeName: required
  - saleType: required
  - All shopAddress fields: required
```

### Step 2: Owner Info
```
Fields:
  - Owner Name * (required)
  - Owner Email Address
  - Owner's Primary Phone
  - Owner's Secondary Phone
  - Owner Address Section:
    - Search Address
    - Street
    - City
    - State
    - Country

Validation:
  - ownerName: required
```

### Step 3: Certification
```
Fields:
  - Official Business Name
  - CAC Number
  - CAC Document (file upload)

Validation:
  - Optional fields
```

### Step 4: Gallery
```
Fields:
  - Shop Photos and Videos (multi-file upload)

Validation:
  - Optional fields
```

## Error Handling

```
Validation Errors:
  Store name required
  All shop address fields required
  Owner name required
  ↓
  Display: Red alert box with error message

API Errors:
  Network error
  Server error (5xx)
  Validation error (4xx)
  ↓
  Display: "Failed to update store. Please try again."
  Show: Specific error from response if available

User Feedback:
  During submit: "Saving..." button state
  Success: Green alert "Store updated successfully!"
  Error: Red alert with error message
  Success auto-closes: After 2 seconds
```

## Performance Considerations

1. **Lazy Loading**: Form only loads when EditStoreModal is opened
2. **Memoization**: Consider memoizing form steps if they become heavy
3. **Validation**: Real-time validation (onChange mode) helps UX
4. **API Optimization**: Only full store data is sent (could be optimized to send only changed fields)
5. **Re-renders**: EditStoreModal is controlled, only re-renders when editingStore changes

## Accessibility

```
Edit Button:
  - Has title attribute: "Edit store"
  - Keyboard accessible (tab, enter)
  - Proper color contrast (indigo on white)
  - Icon + semantic meaning

Form:
  - All inputs have associated labels
  - Error messages linked to fields (aria-invalid)
  - Tab order follows logical flow
  - Focus management in modal
  - Required fields marked with *

Modal:
  - Backdrop click closes (non-destructive)
  - Escape key should close (if implemented)
  - Focus trap within modal
  - Proper z-index layering
```

## Testing Scenarios

```
Test Case 1: Open & Edit Store
  ✓ Click store card
  ✓ Verify StoreDetailsModal opens
  ✓ Verify Edit button visible
  ✓ Click Edit button
  ✓ Verify EditStoreModal opens with pre-filled data
  ✓ Verify form shows all current values

Test Case 2: Edit Single Field
  ✓ Open edit modal
  ✓ Change one field (e.g., store name)
  ✓ Click Save Changes
  ✓ Verify success message
  ✓ Verify store list updates with new value

Test Case 3: Validation
  ✓ Clear required field (store name)
  ✓ Try to save
  ✓ Verify error message appears
  ✓ Verify field remains in form

Test Case 4: Cancel Edit
  ✓ Open edit modal
  ✓ Change multiple fields
  ✓ Click X button without saving
  ✓ Verify changes not saved
  ✓ Verify store list unchanged

Test Case 5: Navigate Steps
  ✓ In step 1, click Next
  ✓ Verify step 2 content
  ✓ Change field in step 2
  ✓ Go back to step 1
  ✓ Verify previous edits preserved
  ✓ Navigate to step 4
  ✓ Click Save Changes
  ✓ Verify all changes saved

Test Case 6: Error Handling
  ✓ Simulate API error
  ✓ Verify error message displays
  ✓ Verify form remains open
  ✓ Allow user to retry
```

## Future Feature Ideas

1. **Bulk Edit**: Edit multiple stores at once
2. **Field-Level Permissions**: Some fields read-only after approval
3. **Change History**: Track who changed what and when
4. **Conditional Validation**: Different rules based on store type
5. **Auto-Save**: Draft saves to localStorage periodically
6. **Comparison View**: See before/after values
7. **Undo/Redo**: Quick revert functionality
8. **Scheduled Updates**: Schedule changes for future

# AddStoreForm API Integration Fix - Summary

## Problems Identified

### 1. **Missing Redux Integration**
**Problem:** The component was trying to call a local `addVendor()` function that threw an error instead of dispatching the Redux thunk.
```tsx
// WRONG - Local stub function
function addVendor(data: any): any {
  throw new Error('Function not implemented.');
}
```

**Fix:** Now correctly imports and uses the `createVendor` thunk from `vendorSlice`:
```tsx
import { createVendor, fetchVendors } from '@/redux/vendorSlice';
```

---

### 2. **Missing User ID**
**Problem:** The API endpoint **requires `userId`** to create a vendor profile, but the form never extracted it from the auth state.

**Error from API:** `"User ID is required"`

**Fix:** Added userId extraction from Redux auth state:
```tsx
const { userId } = useAppSelector(state => state.auth);

// In onSubmit:
if (!userId) {
  console.error('User ID is required to create a vendor');
  return;
}
```

---

### 3. **Form Field Name Mismatches**

The form fields didn't match the API endpoint expectations:

| **Form Field Name** | **API Expected** | **Fixed** |
|---|---|---|
| `address.street` | `shopAddress` | ✅ `shopAddress` |
| `owner.name` | `ownerName` | ✅ `ownerName` |
| `owner.email` | `ownerEmail` | ✅ `ownerEmail` |
| `owner.primaryPhone` | `ownerPrimaryPhoneNumber` | ✅ `ownerPrimaryPhone` |
| `certification.businessName` | `officialBusinessName` | ✅ `officialBusinessName` |
| `certification.cacNumber` | `cacNumber` | ✅ `cacNumber` |
| `certification.incorporationCertificate` | `cacDocFile` | ✅ `cacDocFile` |
| `gallery.files` | `gallery` | ✅ `gallery` |

---

### 4. **Data Transformation Logic**
**Problem:** Form data wasn't being properly transformed to match the API schema before submission.

**Fix:** Added explicit data transformation in `onSubmit`:
```tsx
const vendorData = {
  userId,
  shopName: data.storeName,
  shopAddress: data.shopAddress,
  shopEmail: data.storeEmail,
  shopPrimaryPhoneNumber: data.storePrimaryPhone,
  shopSecondaryPhoneNumber: data.storeSecondaryPhone,
  saleType: data.salesType,
  discount: data.discount,
  ownerName: data.ownerName,
  ownerAddress: data.ownerAddress,
  ownerEmail: data.ownerEmail,
  ownerPrimaryPhoneNumber: data.ownerPrimaryPhone,
  ownerSecondaryPhoneNumber: data.ownerSecondaryPhone,
  ownerDiscount: data.ownerDiscount,
  businessAccountName: data.businessAccountName,
  officialBusinessName: data.officialBusinessName,
  cacNumber: data.cacNumber,
  cacDocFile: data.cacDocFile,
  gallery: data.gallery || []
};
```

---

## Files Modified

### 1. `components/Forms/stores/AddStoreForm.tsx`
**Changes:**
- ✅ Added `useAppSelector` import to access auth state
- ✅ Changed import from `createVendor` thunk (was importing incorrect signature)
- ✅ Extract `userId` from Redux auth state
- ✅ Validate userId exists before submission
- ✅ Add proper data transformation before API call
- ✅ Remove stub `addVendor` function
- ✅ Dispatch `createVendor` thunk correctly

### 2. `components/Forms/stores/storeformsteps.tsx`
**Changes:**
- ✅ **StoreInfoStep**: 
  - Replaced nested `address.street/city/state` with flat `shopAddress` field
  - Changed field names: `storePrimaryPhone` → `storePrimaryPhone` (kept for consistency)
  - Updated `salesType` select to have a default empty option

- ✅ **OwnerInfoStep**:
  - Changed `owner.name` → `ownerName`
  - Changed `owner.email` → `ownerEmail`
  - Changed `owner.primaryPhone` → `ownerPrimaryPhone`
  - Changed `owner.secondaryPhone` → `ownerSecondaryPhone`
  - Replaced nested `owner.address.street/city/state` with flat `ownerAddress` field
  - Changed `owner.discount` → `ownerDiscount`
  - Changed `owner.bankAccountNumber` → `businessAccountName`

- ✅ **CertificationStep**:
  - Changed `certification.businessName` → `officialBusinessName`
  - Changed `certification.cacNumber` → `cacNumber`
  - Changed `certification.incorporationCertificate` → `cacDocFile` (removed extra fields)

- ✅ **GalleryStep**:
  - Changed `gallery.files` → `gallery`
  - Kept `multiple` attribute for file upload

---

## API Endpoint Requirements
**Endpoint:** `/api/vendor/create` (POST)

**Required Fields:**
- `userId` ✅
- `shopName` ✅
- `shopAddress` ✅
- `ownerName` ✅

**Optional Fields:**
- `shopEmail`, `shopPrimaryPhoneNumber`, `shopSecondaryPhoneNumber`, `saleType`, `discount`
- `ownerAddress`, `ownerEmail`, `ownerPrimaryPhoneNumber`, `ownerSecondaryPhoneNumber`, `ownerDiscount`
- `businessAccountName`, `officialBusinessName`, `cacNumber`, `cacDocFile`, `gallery`

---

## Testing Checklist
- [ ] Ensure user is logged in before opening the form
- [ ] Verify all form fields populate correctly
- [ ] Submit the form and check network tab for POST to `/api/vendor/create`
- [ ] Verify request payload includes `userId` and all required fields
- [ ] Check for successful 201 response
- [ ] Verify vendor list updates after successful submission
- [ ] Test validation messages appear for required fields

---

## Notes
- The form now properly integrates with Redux for state management
- User ID is automatically extracted from the auth state
- All field names match the backend API expectations
- Data transformation happens before submission to ensure consistency
- File uploads (CAC document, gallery) will need proper FormData handling if they're actual files

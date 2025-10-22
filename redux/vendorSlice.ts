import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

interface VendorState {
    vendor: Vendor | null;
    loading: boolean;
    error: string | null;
}

interface Vendor {
    userId: string;
    shopName: string;
    shopAddress: string;
    shopEmail?: string;
    shopPrimaryPhoneNumber?: string;
    shopSecondaryPhoneNumber?: string;
    saleType?: string;
    discount?: number;
    ownerName: string;
    ownerAddress?: string;
    ownerEmail?: string;
    ownerPrimaryPhoneNumber?: string;
    ownerSecondaryPhoneNumber?: string;
    ownerDiscount?: number;
    businessAccountName?: string;
    officialBusinessName?: string;
    cacNumber?: string;
    cacDocFile?: string;
    gallery?: string[];
}

interface ApiError {
    error: string;
}

export const createVendor = createAsyncThunk<
    Vendor,
    Vendor,
    { rejectValue: ApiError }
>(
    'vendor/createVendor',
    async (vendorData, thunkAPI) => {
        const response = await fetch('/api/vendor', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(vendorData),
        });

        if (!response.ok) {
            const errorData: ApiError = await response.json();
            return thunkAPI.rejectWithValue(errorData);
        }

        const data = await response.json();
        return data.vendor;
    }
);

const initialState: VendorState = {
    vendor: null,
    loading: false,
    error: null,
};

const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createVendor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
                state.loading = false;
                state.vendor = action.payload;
            })
            .addCase(createVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to create vendor';
            });
    },
});

export default vendorSlice.reducer;

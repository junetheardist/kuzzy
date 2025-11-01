import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

interface VendorState {
    vendor: Vendor | null;
    vendors: Vendor[];
    loading: boolean;
    error: string | null;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
}

export interface Gallery {
    coverImageUrl: string;
    otherImagesUrl: string[];
}

export interface RegistrationDocuments {
    businessRegistrationUrl: string;
    idType: string;
    idNumber: string;
    idDocumentUrl: string;
    proofOfAddressUrl: string;
}

export interface Vendor {
    address: any;
    id: any;
    _id?: string;
    userId: string;
    logo: string;
    shopName: string;
    shopAddress: string | Address;
    shopEmail?: string;
    shopPrimaryPhoneNumber?: string;
    shopSecondaryPhoneNumber?: string;
    saleType?: string;
    discount?: number;
    ownerName: string;
    ownerAddress?: string | Address;
    ownerEmail?: string;
    ownerPrimaryPhoneNumber?: string;
    ownerSecondaryPhoneNumber?: string;
    ownerDiscount?: number;
    businessAccountName?: string;
    officialBusinessName?: string;
    cacNumber?: string;
    cacDocFile?: string;
    gallery?: string[] | Gallery;
    status: string;
    category: string;
    dateJoined: string;
    registrationDocuments: RegistrationDocuments;
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
        const response = await fetch('/api/vendor/create', {
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

// --- GET All Vendors ---
export const fetchVendors = createAsyncThunk<
    Vendor[],
    void,
    { rejectValue: ApiError }
>("vendor/fetchVendors", async (_, thunkAPI) => {
    const res = await fetch("/api/vendor");

    if (!res.ok) {
        const err: ApiError = await res.json();
        return thunkAPI.rejectWithValue(err);
    }

    const data = await res.json();
    return data.vendors;
});

// --- GET One Vendor ---
export const fetchVendorById = createAsyncThunk<
    Vendor,
    string,
    { rejectValue: ApiError }
>("vendor/fetchVendorById", async (id, thunkAPI) => {
    const res = await fetch(`/api/vendor/${id}`);

    if (!res.ok) {
        const err: ApiError = await res.json();
        return thunkAPI.rejectWithValue(err);
    }

    const data = await res.json();
    return data.vendor;
});


export const updateVendor = createAsyncThunk<
    Vendor,
    Partial<Vendor>,
    { rejectValue: ApiError }
>(
    'vendor/updateVendor',
    async (vendorData, thunkAPI) => {
        const response = await fetch('/api/vendor', {
            method: 'PUT',
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

// --- DELETE Vendor ---
export const deleteVendor = createAsyncThunk<
    string,
    string,
    { rejectValue: ApiError }
>("vendor/deleteVendor", async (id, thunkAPI) => {
    const res = await fetch(`/api/vendor/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const err: ApiError = await res.json();
        return thunkAPI.rejectWithValue(err);
    }

    return id; // return deleted ID for easy local update
});


const initialState: VendorState = {
    vendor: null,
    loading: false,
    vendors: [],
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
            }).addCase(updateVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateVendor.fulfilled, (state, action: PayloadAction<Vendor>) => {
                state.loading = false;
                state.vendor = action.payload;
            })
            .addCase(updateVendor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Failed to update vendor';
            }) // DELETE
        builder
            .addCase(deleteVendor.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(deleteVendor.fulfilled, (s, a: PayloadAction<string>) => {
                s.loading = false;
                s.vendors = s.vendors.filter((v) => v._id !== a.payload);
            })
            .addCase(deleteVendor.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.error || "Failed to delete vendor";
            })
        // FETCH ONE
        builder
            .addCase(fetchVendorById.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchVendorById.fulfilled, (s, a: PayloadAction<Vendor>) => {
                s.loading = false;
                s.vendor = a.payload;
            })
            .addCase(fetchVendorById.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.error || "Failed to fetch vendor";
            })
        // FETCH ALL
        builder
            .addCase(fetchVendors.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchVendors.fulfilled, (s, a: PayloadAction<Vendor[]>) => {
                s.loading = false;
                s.vendors = a.payload;
            })
            .addCase(fetchVendors.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload?.error || "Failed to fetch vendors";
            });


    },
});

export default vendorSlice.reducer;

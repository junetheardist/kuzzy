import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "/api";

export interface LocationItem {
    _id: string;
    name: string;
    parentId?: string;
}

export interface LocationState {
    countries: LocationItem[];
    regions: LocationItem[];
    states: LocationItem[];
    cities: LocationItem[];
    streets: LocationItem[];
    loading: boolean;
    error: string | null;
    selected: Record<string, string | undefined>;
}

const initialState: LocationState = {
    countries: [],
    regions: [],
    states: [],
    cities: [],
    streets: [],
    loading: false,
    error: null,
    selected: {},
};

// --- FETCH actions ---
export const fetchCountries = createAsyncThunk("location/fetchCountries", async () => {
    const res = await axios.get(`${BASE_URL}/countries`);
    console.log(res.data);
    return res.data;
});
export const fetchRegions = createAsyncThunk("location/fetchRegions", async (countryId: string) => {
    console.log(countryId);
    const res = await axios.get(`${BASE_URL}/regions/${countryId}`);
    console.log("Hello", res.data);
    return res.data;
});
export const fetchStates = createAsyncThunk("location/fetchStates", async (regionId: string) => {
    const res = await axios.get(`${BASE_URL}/states/${regionId}`);
    return res.data;
});
export const fetchCities = createAsyncThunk("location/fetchCities", async (stateId: string) => {
    const res = await axios.get(`${BASE_URL}/cities/${stateId}`);
    return res.data;
});
export const fetchStreets = createAsyncThunk("location/fetchStreets", async (cityId: string) => {
    const res = await axios.get(`${BASE_URL}/streets/${cityId}`);
    return res.data;
});

// --- CREATE ---
export const createLocation = createAsyncThunk(
    "location/create",
    async ({level, parentId, parentId1, parentId2, parentId3, name}: {
        level: string;
        parentId?: string;
        name: string,
        parentId1?: string,
        parentId2?: string,
        parentId3?: string,
    }) => {
        const res = await axios.post(`${BASE_URL}/${level}`, {parentId, name, parentId1, parentId2, parentId3});
        return {level, data: res.data};
    }
);

// --- UPDATE ---
export const updateLocation = createAsyncThunk(
    "location/update",
    async ({level, id, name}: { level: string; id: string; name: string }) => {
        const res = await axios.put(`${BASE_URL}/${level}/${id}`, {name});
        return {level, data: res.data};
    }
);

// --- DELETE ---
export const deleteLocation = createAsyncThunk(
    "location/delete",
    async ({level, id}: { level: string; id: string }) => {
        await axios.delete(`${BASE_URL}/${level}/${id}`);
        return {level, id};
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setSelected: (state, action) => {
            state.selected = {...state.selected, ...action.payload};
        },
        resetBelowLevel: (state, action) => {
            const level = action.payload;
            switch (level) {
                case "country":
                    state.regions = [];
                    state.states = [];
                    state.cities = [];
                    state.streets = [];
                    break;
                case "region":
                    state.states = [];
                    state.cities = [];
                    state.streets = [];
                    break;
                case "state":
                    state.cities = [];
                    state.streets = [];
                    break;
                case "city":
                    state.streets = [];
                    break;
            }
        },
    },
    extraReducers: (builder) => {
        const pending = (state: LocationState) => {
            state.loading = true;
            state.error = null;
        };
        const fulfilled = (state: LocationState) => {
            state.loading = false;
        };
        const rejected = (state: LocationState, action: any) => {
            state.loading = false;
            state.error = action.error.message;
        };

        builder
            // --- READS ---
            .addCase(fetchCountries.pending, pending)
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                state.countries = action.payload.data;
            })
            .addCase(fetchCountries.rejected, rejected)
            .addCase(fetchRegions.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                state.regions = action.payload.data;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload.data;
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = action.payload.data;
            })
            .addCase(fetchStreets.fulfilled, (state, action) => {
                state.loading = false;
                state.streets = action.payload.data;
            })

            // --- CREATE ---
            .addCase(createLocation.fulfilled, (state, action) => {
                const {level} = action.payload;
                const data = action.payload.data.data;
                console.log("Hi", action.payload);
                console.log("Data", action.payload.data.data);
                (state as any)[`${level}`].push(data);
                state.loading = false;
            })

            // --- UPDATE ---
            .addCase(updateLocation.fulfilled, (state, action) => {
                const {level} = action.payload;
                const data = action.payload.data.data;
                console.log("Hello", action.payload);
                console.log("Data", data);
                const list = (state as any)[`${level}`];
                const index = list.findIndex((item: any) => item._id === data._id);
                if (index !== -1) list[index] = data;
                state.loading = false;
            })

            // --- DELETE ---
            .addCase(deleteLocation.fulfilled, (state, action) => {
                const {level, id} = action.payload;
                const list = (state as any)[`${level}`];
                (state as any)[`${level}`] = list.filter((item: any) => item._id !== id);
                state.loading = false;
            });
    },
});

export const {setSelected, resetBelowLevel} = locationSlice.actions;
export default locationSlice.reducer;

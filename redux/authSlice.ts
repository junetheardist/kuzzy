import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

/* --------------------------- REGISTER --------------------------- */
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (
        {email, password}: { email: string; password: string },
        {rejectWithValue}
    ) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.error || "Registration failed");

            return data; // {message, userId}
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

/* --------------------------- VERIFY OTP --------------------------- */
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (
        {email, otp}: { email: string; otp: string },
        {rejectWithValue}
    ) => {
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, otp}),
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.error || "OTP verification failed");

            return data; // {message, token}
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

/* --------------------------- RESEND OTP --------------------------- */
export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async ({email}: { email: string }, {rejectWithValue}) => {
        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.error || "Failed to resend OTP");

            return data; // {message}
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

/* --------------------------- LOGIN --------------------------- */
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (
        {email, password}: { email: string; password: string },
        {rejectWithValue}
    ) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data.error || "Login failed");

            return data; // {message, token, user: {id, email}}
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

/* --------------------------- FORGOT PASSWORD --------------------------- */
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async ({email}: { email: string }, {rejectWithValue}) => {
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            const data = await res.json();
            if (!res.ok)
                return rejectWithValue(data.error || "Failed to send reset link");

            return data; // {message}
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

/* --------------------------- RESET PASSWORD --------------------------- */
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (
        {token, password}: { token: string; password: string },
        {rejectWithValue}
    ) => {
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token, password}),
            });

            const data = await res.json();
            if (!res.ok)
                return rejectWithValue(data.error || "Failed to reset password");

            return data; // {message}
        } catch (err: any) {
            return rejectWithValue(err.message || "Network error");
        }
    }
);

/* --------------------------- STATE --------------------------- */
interface AuthState {
    loading: boolean;
    error: string | null;
    message: string | null;
    userId: string | null;
    token: string | null;
    user: { id: string; email: string } | null;
    isVerified: boolean;
    email: string | null; // ✅ add this
}

const initialState: AuthState = {
    loading: false,
    error: null,
    message: null,
    userId: null,
    token: null,
    user: null,
    isVerified: false,
    email: null, // ✅ initialize
};

/* --------------------------- SLICE --------------------------- */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
        logoutUser: (state) => {
            state.token = null;
            state.user = null;
            state.isVerified = false;
            state.userId = null;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload; // ✅ update email
        },
        restoreFromCookies: (state, action: PayloadAction<{userId: string; token: string; user: {id: string; email: string}; isVerified: boolean}>) => {
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isVerified = action.payload.isVerified;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: AuthState) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        };
        const handleRejected = (state: AuthState, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            /* REGISTER */
            .addCase(registerUser.pending, handlePending)
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.userId = action.payload.userId;
            })
            .addCase(registerUser.rejected, handleRejected)

            /* VERIFY OTP */
            .addCase(verifyOtp.pending, handlePending)
            .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.userId = action.payload.user?.id; // ✅ SET userId
                state.isVerified = true;
            })
            .addCase(verifyOtp.rejected, handleRejected)

            /* RESEND OTP */
            .addCase(resendOtp.pending, handlePending)
            .addCase(resendOtp.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resendOtp.rejected, handleRejected)

            /* LOGIN */
            .addCase(loginUser.pending, handlePending)
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.userId = action.payload.user?.id; // ✅ SET userId FROM user.id
                state.isVerified = true;
            })
            .addCase(loginUser.rejected, handleRejected)

            /* FORGOT PASSWORD */
            .addCase(forgotPassword.pending, handlePending)
            .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, handleRejected)

            /* RESET PASSWORD */
            .addCase(resetPassword.pending, handlePending)
            .addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, handleRejected);
    },
});

export const {resetAuthState, logoutUser, setEmail, restoreFromCookies} = authSlice.actions;
export default authSlice.reducer;

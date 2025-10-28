"use client";

import {useState} from "react";
import {resendOtp} from "@/redux/authSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";

export default function ResendOtpForm() {
    const dispatch = useAppDispatch();
    const {loading, message, error} = useAppSelector((s) => s.auth);
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(resendOtp({email}));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold mb-2 text-center">Resend OTP</h2>

            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
                {loading ? "Sending..." : "Resend OTP"}
            </button>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
    );
}

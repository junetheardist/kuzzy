"use client";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useState} from "react";
import {resetPassword} from "@/redux/authSlice";

export default function ResetPasswordForm() {
    const dispatch = useAppDispatch();
    const {loading, message, error} = useAppSelector((s) => s.auth);
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(resetPassword({token, password}));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold mb-2 text-center">Reset Password</h2>

            <input
                type="text"
                placeholder="Reset Token"
                className="border p-2 rounded"
                value={token}
                onChange={(e) => setToken(e.target.value)}
            />

            <input
                type="password"
                placeholder="New Password"
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
    );
}

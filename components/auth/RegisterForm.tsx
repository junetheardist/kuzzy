"use client";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useEffect, useState} from "react";
import {registerUser, resetAuthState} from "@/redux/authSlice";

export default function RegisterForm() {
    const dispatch = useAppDispatch();
    const {loading, message, error} = useAppSelector((s) => s.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser({email, password}));
    };

    useEffect(() => {
        return () => {
            dispatch(resetAuthState());
        };
    }, [dispatch]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
                {loading ? "Registering..." : "Register"}
            </button>

            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </form>
    );
}

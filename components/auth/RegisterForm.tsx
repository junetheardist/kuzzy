"use client";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useEffect, useState} from "react";
import {registerUser, resetAuthState} from "@/redux/authSlice";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

export default function RegisterForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {loading, message, error} = useAppSelector((s) => s.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }
        
        setPasswordError("");
        dispatch(registerUser({email, password})).unwrap().then((v) => {
            console.log(v);
            if (v.token) {
                Cookies.set("kuzzy-token", v.token);
                Cookies.set("kuzzy-email", v.user.email);
                Cookies.set("kuzzy-id", v.user.id);
                router.push("/");
            } else {
                // If OTP verification needed
                router.push("/verify-otp");
            }
        });
    };

    useEffect(() => {
        return () => {
            dispatch(resetAuthState());
        };
    }, [dispatch]);

    return (
        <form onSubmit={handleSubmit} className="flex max-w-2xl outline rounded-xl bg-white p-10 min-w-xl flex-col gap-3">
            <h2 className="text-2xl font-semibold mb-2 text-center">Create Account</h2>

            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                }}
                required
            />
            <input
                type="password"
                placeholder="Confirm Password"
                className="border p-2 rounded"
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                }}
                required
            />

            {passwordError && <p className="text-red-600 text-center">{passwordError}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
                {loading ? "Creating Account..." : "Register"}
            </button>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <p className="text-sm text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600">
                    Login here
                </Link>
            </p>
        </form>
    );
}

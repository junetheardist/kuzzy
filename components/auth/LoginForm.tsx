"use client";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useEffect, useState} from "react";
import Link from "next/link";
import {loginUser, resendOtp, setEmail as SetUserEmail} from "@/redux/authSlice";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

export default function LoginForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {loading, message, error} = useAppSelector((s) => s.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({email, password})).unwrap().then((v) => {
            console.log(v)
            Cookies.set("kuzzy-token", v.token);
            Cookies.set("kuzzy-email", v.user.email);
            Cookies.set("kuzzy-id", v.user.id);
            router.push("/");
        });
    };

    useEffect(() => {

        console.log("error", error);
        console.log("message", message);
        if (error === "Please verify your email first") {
            dispatch(SetUserEmail(email))
            dispatch(resendOtp({email})).unwrap().then(() => {
                router.push("/verify-otp");
            })
        }

    }, [error, message])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>

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
                {loading ? "Logging in..." : "Login"}
            </button>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <p className="text-sm text-center mt-2">
                Forgot password?{" "}
                <Link href="/auth/forgot-password" className="text-blue-600">
                    Reset it
                </Link>
            </p>

            <p className="text-sm text-center">
                Don’t have an account?{" "}
                <Link href="/auth/register" className="text-blue-600">
                    Register
                </Link>
            </p>
        </form>
    );
}

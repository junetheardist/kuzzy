"use client";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useState} from "react";
import {resendOtp, verifyOtp} from "@/redux/authSlice";
import {useRouter} from "next/navigation";

export default function VerifyOtpForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {loading, message, error, email} = useAppSelector((s) => s.auth);

    const [otp, setOtp] = useState("");
    const [inputError, setInputError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate OTP is provided
        if (!otp.trim()) {
            setInputError("Please enter the OTP");
            return;
        }
        
        // Validate OTP is 6 digits
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setInputError("OTP must be 6 digits");
            return;
        }
        
        // Clear previous errors
        setInputError("");
        
        if (!email) {
            setInputError("Email not found. Please register again.");
            return;
        }
        
        dispatch(verifyOtp({email, otp}))
            .unwrap()
            .then(() => {
                router.push("/login");
            })
            .catch((error) => {
                console.error('OTP verification failed:', error);
                // Error is already displayed via Redux state
            });
    };

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setInputError("Email not found. Please register again.");
            return;
        }
        
        dispatch(resendOtp({email}))
            .then((v) => {
                if (v.payload === "User already verified") {
                    router.push("/login");
                }
            })
            .catch((e) => {
                console.error('Resend OTP failed:', e);
            });
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
        // Clear input error when user starts typing
        if (inputError) setInputError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form 
                onSubmit={handleSubmit}
                className="outline rounded-xl bg-white p-10 min-w-xl flex flex-col gap-3 max-w-2xl shadow-lg"
            >
                <h2 className="text-2xl font-semibold mb-2 text-center">Verify Email</h2>
                
                {email && (
                    <p className="text-sm text-center text-gray-600 mb-4">
                        A verification code has been sent to<br/>
                        <strong>{email}</strong>
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={loading}
                    autoComplete="off"
                    maxLength={6}
                />

                <button
                    type="submit"
                    disabled={loading || !otp || otp.length !== 6}
                    className="bg-blue-600 text-white py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                {inputError && <p className="text-red-600 text-center text-sm">{inputError}</p>}
                {message && <p className="text-green-600 text-center text-sm">{message}</p>}
                {error && <p className="text-red-600 text-center text-sm">{error}</p>}

                <p className="text-sm text-center mt-4">
                    Didn't get OTP?{" "}
                    <button 
                        type="button"
                        onClick={handleResend}
                        disabled={loading}
                        className="text-blue-600 hover:underline disabled:opacity-50"
                    >
                        Resend OTP
                    </button>
                </p>
            </form>
        </div>
    );
}

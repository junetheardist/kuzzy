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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            dispatch(verifyOtp({email, otp})).unwrap().then(() => {
                router.push("/login");
            });
        }
    };

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("resend otp");
        if (email) {
            dispatch(resendOtp({email})).then((v) => {
                if (v.payload === "User already verified") {
                    router.push("/login");
                }
            }).catch((e) => {
                console.error(e);
            });
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold mb-2 text-center">Verify OTP</h2>


            <input
                type="text"
                placeholder="Enter OTP"
                className="border p-2 rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />

            <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
                {loading ? "Verifying..." : "Verify"}
            </button>

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <p className="text-sm text-center mt-2">
                Didn’t get OTP?{" "}
                <button onClick={handleResend} className="text-blue-600">
                    Resend OTP
                </button>
            </p>
        </div>
    );
}

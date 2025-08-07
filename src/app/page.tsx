"use client";
import { useState, useEffect } from "react";

export default function Home() {
    const [linked, setLinked] = useState(false);
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function checkStatus() {
            const res = await fetch("/api/auth/status");
            const data = await res.json();
            setLinked(data.linked);
        }
        checkStatus();
    }, []);

    const signInWithGitHub = () => {
        window.location.href = "/api/auth/github";
    };

    const completePayment = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/complete-payment", {
                method: "POST",
            });
            const data = await res.json();
            if (data.success) {
                setPaid(true);
                setMessage(
                    "Payment successful! Check your GitHub email for the repo invitation."
                );
            } else {
                setMessage(data.error || "Something went wrong. Try again.");
            }
        } catch {
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Private Repo Access
                </h1>
                <p className="text-gray-600 mb-6">
                    Sign in with GitHub and complete your payment to get
                    read‑only access to our private repository.
                </p>

                {!linked ? (
                    <button
                        onClick={signInWithGitHub}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
                    >
                        Sign in with GitHub
                    </button>
                ) : !paid ? (
                    <button
                        onClick={completePayment}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg text-white transition ${
                            loading
                                ? "bg-gray-400"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        {loading ? "Processing..." : "Complete Payment"}
                    </button>
                ) : (
                    <p className="text-green-600 font-medium">
                        Payment complete! Invitation sent to your GitHub email.
                    </p>
                )}

                {message && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
}

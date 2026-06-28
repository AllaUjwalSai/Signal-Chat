"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function sendOTP() {
    if (!phone.trim()) {
      alert("Please enter a phone number");
      return;
    }

    alert("Mock OTP sent! Enter any 6 digits.");
    setOtpSent(true);
  }

  function verifyOTP() {
    if (otp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    setVerified(true);
  }

  async function register() {
    try {
      await api.post("/auth/register", {
        display_name: displayName,
        username,
        phone,
        password,
      });

      alert("Account created successfully!");

      router.push("/login");
    } catch (err: any) {
      alert(
        err?.response?.data?.detail ??
          "Registration failed"
      );
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white dark:bg-[#202c33] p-8 rounded-xl shadow w-96">

        <h1 className="text-2xl font-bold mb-6">
          Create Account
        </h1>

        {!otpSent && (
          <>
            <input
              className="border dark:border-[#2a3942] w-full p-3 rounded mb-6"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendOTP}
              className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {otpSent && !verified && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Mock OTP: Enter any 6 digits
            </p>

            <input
              className="border dark:border-[#2a3942] w-full p-3 rounded mb-6 text-center tracking-[8px]"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOTP}
              className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {verified && (
          <>
            <div className="mb-4 text-green-600 font-medium">
              ✓ Phone Verified
            </div>

            <input
              className="border w-full p-3 rounded mb-4"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <input
              className="border w-full p-3 rounded mb-4"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              className="border w-full p-3 rounded mb-6"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={register}
              className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
          </>
        )}

      </div>

    </div>
  );
}
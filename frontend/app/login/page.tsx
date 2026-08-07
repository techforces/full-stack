"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Button from "../components/Button";
import Input from "../components/Input";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Failed to log in");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 text-night">
      <h1 className="text-[2rem]">Log in</h1>

      <form className="w-full max-w-[24rem] flex flex-col gap-6 items-center">
        <div className="w-full flex flex-col gap-6">
          <Input
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            setter={setEmail}
          />
          <Input
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            setter={setPassword}
          />
        </div>

        {error && <p className="text-red-600 text-base">{error}</p>}

        <Button
          disabled={isSubmitting}
          label={isSubmitting ? "Logging in..." : "Log in"}
          onClick={handleSubmit}
        />

        <p className="text-base text-grey">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

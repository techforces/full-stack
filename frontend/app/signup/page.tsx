"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Button from "../components/Button";
import Input from "../components/Input";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
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

      const response = await apiFetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Failed to sign up");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 text-night">
      <h1 className="text-[2rem]">Sign up</h1>

      <form className="w-full max-w-[24rem] flex flex-col gap-6 items-center">
        <div className="w-full flex flex-col gap-6">
          <Input
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={name}
            setter={setName}
          />
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
          label={isSubmitting ? "Signing up..." : "Sign up"}
          onClick={handleSubmit}
        />

        <p className="text-base text-grey">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

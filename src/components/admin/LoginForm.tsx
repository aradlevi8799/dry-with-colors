"use client";

import { useState } from "react";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setError("סיסמה שגויה");
      }
    } catch {
      setError("שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-sand p-8 shadow-lg animate-fade-up"
      >
        {/* Decorative header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-gradient-to-l from-terracotta/40 to-transparent" />
          <svg className="h-3 w-3 text-terracotta/50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" />
          </svg>
          <div className="h-px w-8 bg-gradient-to-r from-terracotta/40 to-transparent" />
        </div>

        <h1 className="mb-6 text-center font-heading text-3xl font-bold text-[#8B6F57]">
          כניסת מנהל
        </h1>

        <label className="block text-lg font-bold text-charcoal-light mb-2">
          סיסמה
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-taupe/30 bg-white px-4 py-3 text-xl text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          placeholder="הזיני סיסמה..."
          autoFocus
        />

        {error && (
          <p className="mt-2 text-lg font-bold text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full rounded-lg bg-terracotta py-3.5 text-xl font-bold text-white transition-colors hover:bg-terracotta-dark active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </div>
  );
}

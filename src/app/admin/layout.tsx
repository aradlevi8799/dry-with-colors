"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setChecking(false);
      }
    }
    check();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
        <span className="text-lg text-taupe font-bold animate-pulse">טוען...</span>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  return <>{children}</>;
}

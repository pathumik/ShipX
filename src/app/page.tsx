"use client";

import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  const { state, setNickname, setCurrentStep } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    // If user already has a session with progress, redirect to map
    if (state.nickname && state.map) {
      router.push("/map");
    }
  }, [state.nickname, state.map, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setNickname(name.trim());
      setCurrentStep("input");
      router.push("/input");
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />
      
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)] rounded-full opacity-5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--tertiary)] rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className={`relative z-10 max-w-md w-full text-center ${isAnimated ? "animate-fade-in" : "opacity-0"}`}>
        {/* Logo */}
        <div className={`mb-8 ${isAnimated ? "animate-slide-down" : "opacity-0"}`}>
          <h1 className="text-5xl font-bold gradient-text mb-2">ShipX</h1>
          <p className="text-[var(--text-dim)] text-lg">
            Turn uncertainty into clarity
          </p>
        </div>

        {/* Tagline */}
        <div className={`mb-12 ${isAnimated ? "animate-slide-up delay-200" : "opacity-0"}`}>
          <p className="text-xl text-[var(--foreground)] leading-relaxed">
            Map your idea&apos;s blind spots.
            <br />
            <span className="text-[var(--primary)]">Validate before you build.</span>
          </p>
        </div>

        {/* Name input form */}
        <form 
          onSubmit={handleSubmit} 
          className={`space-y-6 ${isAnimated ? "animate-slide-up delay-300" : "opacity-0"}`}
        >
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="block text-[var(--text-dim)] text-sm font-medium"
            >
              What should we call you?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl text-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              autoFocus
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 px-8 rounded-xl text-lg font-semibold btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all"
          >
            Start Mapping
          </button>
        </form>

        {/* Footer hint */}
        <p className={`mt-8 text-sm text-[var(--text-muted)] ${isAnimated ? "animate-fade-in delay-500" : "opacity-0"}`}>
          3 questions. 2 minutes. Real clarity.
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--primary)] opacity-60" />
        <div className="w-2 h-2 rounded-full bg-[var(--surface-border)]" />
        <div className="w-2 h-2 rounded-full bg-[var(--surface-border)]" />
      </div>
    </div>
  );
}

"use client";

import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "What are you trying to make true?",
    placeholder: "Describe your idea or vision...",
    hint: "Be specific about the outcome you want to create",
  },
  {
    id: 2,
    question: "What could kill this fastest?",
    placeholder: "What's the biggest risk or unknown...",
    hint: "Think about what assumption, if wrong, would make this fail",
  },
  {
    id: 3,
    question: "Who is this for?",
    placeholder: "Describe your target user or context...",
    hint: "Be specific about who would benefit most",
  },
];

export default function InputPage() {
  const { state, setRawIdeaInput, setCurrentStep } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Redirect if no nickname
    if (!state.nickname) {
      router.push("/");
      return;
    }
    setIsAnimated(true);
  }, [state.nickname, router]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setIsAnimated(false);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setIsAnimated(true);
      }, 200);
    } else {
      // Combine answers and proceed to processing
      const combinedInput = `
Idea: ${answers[0]}

Biggest Risk: ${answers[1]}

Target User: ${answers[2]}
      `.trim();
      
      setRawIdeaInput(combinedInput);
      setCurrentStep("processing");
      router.push("/map");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setIsAnimated(false);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        setIsAnimated(true);
      }, 200);
    } else {
      router.push("/");
    }
  };

  const currentQ = QUESTIONS[currentQuestion];
  const currentAnswer = answers[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const canProceed = currentAnswer.trim().length > 10;

  // Personalized greeting for first question
  const greeting = currentQuestion === 0 
    ? `Alright ${state.nickname}, let's explore your idea...`
    : null;

  return (
    <div className="min-h-screen min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]" />
      
      {/* Progress bar */}
      <div className="relative z-10 w-full h-1 bg-[var(--surface)]">
        <div 
          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] transition-all duration-500"
          style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 text-[var(--text-dim)] hover:text-[var(--foreground)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm text-[var(--text-muted)]">
          {currentQuestion + 1} of {QUESTIONS.length}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center p-6 relative z-10">
        <div className={`max-w-lg mx-auto w-full ${isAnimated ? "animate-slide-up" : "opacity-0"}`}>
          {/* Greeting (first question only) */}
          {greeting && (
            <p className="text-[var(--primary)] text-sm font-medium mb-4 animate-fade-in">
              {greeting}
            </p>
          )}

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)] mb-2">
            {currentQ.question}
          </h2>
          <p className="text-[var(--text-dim)] text-sm mb-6">
            {currentQ.hint}
          </p>

          {/* Answer textarea */}
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={currentQ.placeholder}
            rows={5}
            className="w-full px-5 py-4 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl text-lg text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-none"
            autoFocus
          />

          {/* Character hint */}
          <p className="text-xs text-[var(--text-muted)] mt-2">
            {currentAnswer.length < 10 
              ? `At least ${10 - currentAnswer.length} more characters needed`
              : "Looking good!"
            }
          </p>
        </div>
      </div>

      {/* Footer with button */}
      <footer className="relative z-10 p-6 pb-8">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="w-full py-4 px-8 rounded-xl text-lg font-semibold btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all"
          >
            {isLastQuestion ? "Generate My Map" : "Continue"}
          </button>
        </div>
      </footer>

      {/* Decorative dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {QUESTIONS.map((_, idx) => (
          <div 
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentQuestion 
                ? "bg-[var(--primary)]" 
                : idx < currentQuestion 
                  ? "bg-[var(--primary)] opacity-40" 
                  : "bg-[var(--surface-border)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

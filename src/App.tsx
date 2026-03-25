/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Rocket } from "lucide-react";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { PRDForm } from "./components/PRDForm";
import { PRDDisplay } from "./components/PRDDisplay";
import { generatePRD, PRDData } from "./services/gemini";

export default function App() {
  const [prdData, setPrdData] = useState<PRDData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (prdData) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [prdData]);

  const handleGenerate = async (formData: { idea: string; audience: string; features: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePRD(formData.idea, formData.audience, formData.features);
      setPrdData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PRD. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrdData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-pink-500/30 font-sans bg-[#0a0a0a] flex flex-col relative overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Cursor Glow (Hidden on mobile) */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 150 }}
      />

      {/* Navbar */}
      <nav className="shrink-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white">
              <Rocket size={22} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">ProdDraft</span>
          </div>
          {prdData && (
            <button 
              onClick={handleReset}
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              New Project
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 relative z-10 px-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full py-12 md:py-0">
          <AnimatePresence mode="wait">
            {!prdData ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full"
              >
                <div className="flex flex-col justify-center text-center lg:text-left">
                  <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent leading-[1.1] tracking-tight">
                    From Idea to PRD — Instantly
                  </h1>
                  <p className="text-xl text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                    Turn raw ideas into structured product blueprints using AI.
                  </p>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <PRDForm onSubmit={handleGenerate} isLoading={isLoading} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col py-8"
              >
                <div className="flex-1">
                  <PRDDisplay data={prdData} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!prdData && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="shrink-0 py-8 flex justify-center items-center gap-2 text-slate-600 text-xs font-black uppercase tracking-[0.3em]"
          >
            <div className="w-8 h-[1px] bg-slate-800" />
            Created by Vishnu
            <div className="w-8 h-[1px] bg-slate-800" />
          </motion.footer>
        )}
      </main>
    </div>
  );
}

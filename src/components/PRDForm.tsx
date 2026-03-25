import { motion } from "motion/react";
import { Loader2, Sparkles, Lightbulb, Users, List, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../utils/cn";

interface PRDFormProps {
  onSubmit: (data: { idea: string; audience: string; features: string }) => void;
  isLoading: boolean;
}

export const PRDForm: React.FC<PRDFormProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea || !audience || !features) return;
    onSubmit({ idea, audience, features });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className="w-full max-w-lg p-6 rounded-[2rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group/card"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Architect</h2>
          <p className="text-slate-500 text-xs font-medium">Define your vision.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-pink-500 transition-colors">
            <Lightbulb size={12} />
            The Vision
          </label>
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="What are we building?"
              className="w-full min-h-[100px] p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all resize-none text-slate-200 placeholder:text-slate-700 text-sm font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-purple-500 transition-colors">
            <Users size={12} />
            The Audience
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="Who is this for?"
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all text-slate-200 placeholder:text-slate-700 text-sm font-medium"
            required
          />
        </div>

        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-orange-500 transition-colors">
            <List size={12} />
            The Essentials
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="List core features..."
            className="w-full min-h-[100px] p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all resize-none text-slate-200 placeholder:text-slate-700 text-sm font-medium"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 group relative overflow-hidden",
            isLoading 
              ? "bg-slate-900 cursor-not-allowed" 
              : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 shadow-[0_20px_40px_-10px_rgba(236,72,153,0.4)] hover:bg-[length:200%_auto] animate-gradient-shift"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Architecting...
            </>
          ) : (
            <>
              <span className="relative z-10">Generate PRD</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

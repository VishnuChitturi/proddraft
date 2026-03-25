import { motion, useScroll, useTransform } from "motion/react";
import React from "react";

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0a0a0a]">
      {/* Rotating Mesh Gradients */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] opacity-30 blur-[100px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-orange-500/40 rounded-full" />
      </motion.div>
      
      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ willChange: "transform" }}
        className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[120%] opacity-20 blur-[100px]"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-magenta-600/30 to-amber-500/30 rounded-full" />
      </motion.div>

      {/* Floating Glowing Blobs */}
      <motion.div
        animate={{
          x: [-10, 10, -10],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]"
      />
      
      <motion.div
        animate={{
          x: [10, -10, 10],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]"
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Subtle Grid for Depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%) opacity-40" />
    </div>
  );
};

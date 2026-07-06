import React from "react";
import { motion } from "framer-motion";

const blobs = [
  {
    cls: "bg-[#d91636]/[0.09] top-[-14%] left-[-12%] h-[55vw] w-[55vw] max-h-[720px] max-w-[720px]",
    anim: { x: ["0%", "18%", "-6%", "0%"], y: ["0%", "22%", "8%", "0%"], scale: [1, 1.15, 0.95, 1] },
    dur: 32,
  },
  {
    cls: "bg-[#7a1024]/[0.14] bottom-[-18%] right-[-14%] h-[60vw] w-[60vw] max-h-[780px] max-w-[780px]",
    anim: { x: ["0%", "-16%", "8%", "0%"], y: ["0%", "-18%", "-4%", "0%"], scale: [1, 0.9, 1.12, 1] },
    dur: 38,
  },
  {
    cls: "bg-[#b9a2c2]/[0.05] top-[35%] left-[38%] h-[42vw] w-[42vw] max-h-[560px] max-w-[560px]",
    anim: { x: ["0%", "-22%", "14%", "0%"], y: ["0%", "16%", "-14%", "0%"], scale: [1, 1.2, 0.9, 1] },
    dur: 28,
  },
];

const LiquidBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden data-testid="liquid-background">
    {blobs.map((b, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full blur-[130px] ${b.cls}`}
        animate={b.anim}
        transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
    <div className="absolute inset-0 lucy-noise opacity-60" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
  </div>
);

export default LiquidBackground;

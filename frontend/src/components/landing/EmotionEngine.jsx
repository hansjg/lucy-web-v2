import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const emotions = [
  {
    id: "joy",
    label: "Joy",
    color: "#e8b44a",
    line: "I love when you do that — try it again?",
    desc: "Eyes widen, a bounce in her voice. Lucy crossfades into joy with a spring in every gesture.",
    eye: "M20 32 Q32 16 44 32",
    mouth: "M30 60 Q50 80 70 60",
  },
  {
    id: "curiosity",
    label: "Curiosity",
    color: "#b9a2c2",
    line: "Wait. Show me that one more time?",
    desc: "One eyebrow up, leaning toward the camera. She points at the thing she wants to understand.",
    eye: "M20 30 Q32 22 44 30",
    mouth: "M36 64 Q50 68 64 64",
  },
  {
    id: "surprise",
    label: "Surprise",
    color: "#f01e42",
    line: "Wait — really?! That changes everything.",
    desc: "A sharp intake, eyes wide open. Her whole posture reacts in a single smooth transition.",
    eye: "M20 28 Q32 10 44 28",
    mouth: "M42 58 Q50 74 58 58",
  },
  {
    id: "calm",
    label: "Calm",
    color: "#8fa98f",
    line: "Take your time. I'm here whenever you're ready.",
    desc: "Soft smile, slow blink, steady voice. Explanations slow down so you can actually follow.",
    eye: "M20 34 Q32 30 44 34",
    mouth: "M32 62 Q50 70 68 62",
  },
];

const EmotionEngine = () => {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(emotions.length - 1, Math.max(0, Math.floor(v * emotions.length)));
    if (idx !== active) setActive(idx);
  });

  const e = emotions[active];

  return (
    <section id="emotions" ref={ref} data-testid="emotions-section" className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="flex justify-center">
            <Orb emotion={e} />
          </div>

          <div>
            <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[#d91636]">
              // Emotion engine
            </div>
            <h2 className="font-heading mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-white">
              She doesn&apos;t just answer.
              <br />
              She <span style={{ color: e.color, transition: "color 0.6s" }}>reacts</span>.
            </h2>

            <div className="mt-8 min-h-[150px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  data-testid={`emotion-panel-${e.id}`}
                >
                  <div
                    className="font-mono-ui text-[11px] tracking-[0.3em] uppercase"
                    style={{ color: e.color }}
                  >
                    State :: {e.label}
                  </div>
                  <p className="font-heading mt-3 text-2xl sm:text-3xl font-semibold text-white leading-snug">
                    “{e.line}”
                  </p>
                  <p className="mt-4 text-zinc-400 leading-relaxed max-w-md">{e.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center gap-2.5">
              {emotions.map((em, i) => (
                <div
                  key={em.id}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === active ? 42 : 18,
                    background: i === active ? em.color : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
              <span className="ml-3 font-mono-ui text-[9px] tracking-[0.25em] uppercase text-zinc-600">
                keep scrolling
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Orb = ({ emotion }) => (
  <div className="relative w-[260px] sm:w-[340px] aspect-square" data-testid="emotion-orb">
    <motion.div
      animate={{ backgroundColor: emotion.color, scale: [1, 1.12, 1] }}
      transition={{
        backgroundColor: { duration: 0.9 },
        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute inset-0 rounded-full opacity-25 blur-[70px]"
    />
    <div
      className="absolute -inset-5 rounded-full opacity-40"
      style={{
        background: `conic-gradient(from 0deg, transparent 0%, ${emotion.color}44 25%, transparent 50%, ${emotion.color}22 75%, transparent 100%)`,
        animation: "lucy-spin 18s linear infinite",
        transition: "background 0.9s",
      }}
    />
    <div className="absolute inset-0 rounded-full glass !bg-black/40 grid place-items-center overflow-hidden">
      <motion.div
        animate={{ backgroundColor: emotion.color }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 opacity-[0.07]"
      />
      <svg viewBox="0 0 100 100" className="w-[62%] h-[62%]" fill="none">
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          strokeWidth="0.75"
          animate={{ stroke: emotion.color }}
          transition={{ duration: 0.9 }}
          strokeOpacity="0.35"
        />
        <motion.path
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ d: emotions[0].eye, stroke: emotions[0].color }}
          animate={{ d: emotion.eye, stroke: emotion.color }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          transform="translate(-3 6) scale(0.85)"
        />
        <motion.path
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ d: emotions[0].eye, stroke: emotions[0].color }}
          animate={{ d: emotion.eye, stroke: emotion.color }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          transform="translate(35 6) scale(0.85)"
        />
        <motion.path
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ d: emotions[0].mouth, stroke: emotions[0].color }}
          animate={{ d: emotion.mouth, stroke: emotion.color }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  </div>
);

export default EmotionEngine;

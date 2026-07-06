import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

/*
 * The "alive" act — a pinned 300vh scrub. Lucy (in LucyStage) stands
 * center stage; scrolling walks her through emotional states. Each state
 * change is broadcast so the stage swaps her pose and rim-light halo.
 * Copy sits left, a live "state monitor" card sits right.
 */

const STATES = [
  {
    id: "joy",
    label: "Joy",
    pose: "excited",
    halo: "pink",
    color: "#d8578f",
    line: "You got it working?! Show me, show me —",
    desc: "Eyes bright, bouncing on the spot. Your wins are shared property.",
  },
  {
    id: "curiosity",
    label: "Curiosity",
    pose: "point",
    halo: "blue",
    color: "#4f74d9",
    line: "Hold on — what's that in the corner of your screen?",
    desc: "She leans in and points at the thing she wants to understand.",
  },
  {
    id: "calm",
    label: "Calm",
    pose: "base",
    halo: "mint",
    color: "#2f9e6b",
    line: "Take your time. I'm not going anywhere.",
    desc: "Slow voice, soft answers. Patience is her default setting.",
  },
  {
    id: "mischief",
    label: "Mischief",
    pose: "shush",
    halo: "lilac",
    color: "#8a63e8",
    line: "Don't tell anyone, but I stacked the deck.",
    desc: "She bluffs, teases and keeps your secrets — mostly.",
  },
];

const EmotionEngine = () => {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(STATES.length - 1, Math.max(0, Math.floor(v * STATES.length)));
    if (idx !== active) setActive(idx);
  });

  const s = STATES[active];

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("lucy:state", { detail: { pose: s.pose, halo: s.halo } })
    );
  }, [s]);

  return (
    <section id="emotions" ref={ref} data-testid="emotions-section" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Mobile: Lucy inline, centered */}
        <div className="md:hidden h-full flex flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={s.pose}
              src={`/lucy/${s.pose}.png`}
              alt="Lucy"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="h-[34vh] w-auto drop-shadow-[0_16px_30px_rgba(97,84,140,0.25)]"
            />
          </AnimatePresence>
          <StateCopy s={s} center />
          <Dots active={active} />
        </div>

        {/* Desktop: copy left, monitor right — Lucy holds center via LucyStage */}
        <div className="hidden md:block h-full">
          <div className="absolute left-[7vw] top-1/2 -translate-y-1/2 max-w-sm">
            <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[color:var(--pulse)]">
              // Emotion engine
            </div>
            <h2 className="font-heading mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-[color:var(--ink)]">
              She doesn&apos;t just answer.
              <br />
              She <span style={{ color: s.color, transition: "color 0.7s" }}>reacts</span>.
            </h2>
            <StateCopy s={s} />
            <Dots active={active} />
          </div>

          <div className="absolute right-[6vw] top-1/2 -translate-y-1/2 w-72">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ type: "spring", stiffness: 70, damping: 20 }}
              data-testid="emotion-state-monitor"
              className="glass rounded-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
                  state monitor
                </span>
                <span className="flex items-center gap-1.5 font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[#2f9e6b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#46c589] lucy-blink" />
                  live
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full transition-colors duration-700"
                  style={{ background: s.color, boxShadow: `0 0 14px ${s.color}55` }}
                />
                <span
                  className="font-heading text-xl font-bold transition-colors duration-700"
                  style={{ color: s.color }}
                >
                  {s.label}
                </span>
              </div>
              <div className="mt-4 flex items-end gap-[3px] h-10">
                {Array.from({ length: 22 }).map((_, i) => (
                  <span
                    key={i}
                    className="lucy-bar w-[3px] rounded-full transition-colors duration-700"
                    style={{
                      height: `${8 + ((i * 13) % 26)}px`,
                      animationDelay: `${(i % 8) * 0.08}s`,
                      background: s.color,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 font-mono-ui text-[10px] text-[color:var(--ink-faint)] leading-relaxed">
                expression: {s.pose}
                <br />
                transition: 420 ms · spring
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StateCopy = ({ s, center = false }) => (
  <div className={`mt-7 min-h-[130px] ${center ? "max-w-sm" : ""}`}>
    <AnimatePresence mode="wait">
      <motion.div
        key={s.id}
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        data-testid={`emotion-panel-${s.id}`}
      >
        <p className="font-heading text-2xl font-semibold text-[color:var(--ink)] leading-snug">
          &ldquo;{s.line}&rdquo;
        </p>
        <p className="mt-3 text-[color:var(--ink-soft)] leading-relaxed">{s.desc}</p>
      </motion.div>
    </AnimatePresence>
  </div>
);

const Dots = ({ active }) => (
  <div className="mt-8 flex items-center gap-2.5 justify-center md:justify-start">
    {STATES.map((em, i) => (
      <div
        key={em.id}
        className="h-1 rounded-full transition-all duration-500"
        style={{
          width: i === active ? 42 : 18,
          background: i === active ? em.color : "rgba(50,43,61,0.14)",
        }}
      />
    ))}
    <span className="ml-3 font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
      keep scrolling
    </span>
  </div>
);

export default EmotionEngine;

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/*
 * PrismBackground — the ambient light layer for the whole page.
 * Diagonal pastel rays (Lucy's hair tones) drift on long, co-prime
 * durations so the composition never visibly repeats. The whole layer
 * parallaxes upward and cools (hue-rotate) as the page scrolls.
 * Only transform/opacity/filter animate — everything stays on the GPU.
 */

const RAYS = [
  { color: "var(--iris-pink)", top: "-12%", height: "24vmax", dur: 47, drift: 5, opacity: 0.6 },
  { color: "var(--iris-blue)", top: "16%", height: "28vmax", dur: 61, drift: -6, opacity: 0.55 },
  { color: "var(--iris-lilac)", top: "42%", height: "22vmax", dur: 73, drift: 7, opacity: 0.5 },
  { color: "var(--iris-mint)", top: "66%", height: "20vmax", dur: 89, drift: -5, opacity: 0.42 },
  { color: "var(--iris-gold)", top: "86%", height: "18vmax", dur: 101, drift: 4, opacity: 0.35 },
];

const PrismBackground = () => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-9vh"]);
  const hue = useTransform(scrollYProgress, [0, 1], ["hue-rotate(0deg)", "hue-rotate(13deg)"]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
      data-testid="prism-background"
      style={{ background: "var(--prism-white)" }}
    >
      <motion.div style={{ y, filter: hue }} className="absolute -inset-y-[12vh] inset-x-0">
        {RAYS.map((r, i) => (
          <div
            key={i}
            className="absolute left-1/2 w-[165vmax]"
            style={{
              top: r.top,
              height: r.height,
              transform: "translateX(-50%) rotate(-32deg)",
            }}
          >
            <motion.div
              className="h-full w-full"
              style={{
                background: `linear-gradient(90deg, transparent 6%, ${r.color} 48%, transparent 94%)`,
                filter: "blur(64px)",
                opacity: r.opacity,
              }}
              animate={
                reduced
                  ? undefined
                  : {
                      x: ["0%", `${r.drift}%`, "0%"],
                      y: ["0%", `${-r.drift * 0.6}%`, "0%"],
                      opacity: [r.opacity, r.opacity * 0.72, r.opacity],
                    }
              }
              transition={{ duration: r.dur, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        ))}

        <motion.div
          className="absolute left-1/2 top-[8%] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(247,206,220,0.35) 42%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 37, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="absolute inset-0 lucy-noise" />
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, rgba(253,252,254,0.85), transparent)" }}
      />
    </div>
  );
};

export default PrismBackground;

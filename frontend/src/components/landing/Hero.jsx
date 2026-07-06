import React from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

/*
 * Hero — a 260vh pinned act scrubbed by scroll (desktop).
 * Lucy herself lives in LucyStage (fixed layer); this section owns the
 * track that drives her hero choreography plus the text layers:
 *   load       — "Meet Lucy" blur-fades in out of the light
 *   p 0.05–0.2 — title exits upward as she starts the drop
 *   p 0.48–.78 — tagline 1 passes through
 *   p 0.80–1.0 — tagline 2 rides in while she docks right
 */

const Hero = ({ trackRef }) => {
  const { scrollYProgress: p } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(p, [0.05, 0.2], [1, 0]);
  const titleY = useTransform(p, [0.05, 0.2], [0, -70]);
  const titleBlurV = useTransform(p, [0.05, 0.2], [0, 10]);
  const titleFilter = useMotionTemplate`blur(${titleBlurV}px)`;

  const cueOpacity = useTransform(p, [0, 0.06], [1, 0]);

  const tag1Opacity = useTransform(p, [0.48, 0.58, 0.68, 0.78], [0, 1, 1, 0]);
  const tag1Y = useTransform(p, [0.48, 0.78], [26, -26]);

  const tag2Opacity = useTransform(p, [0.8, 0.9, 0.98, 1], [0, 1, 1, 0.9]);
  const tag2X = useTransform(p, [0.8, 0.94], [36, 0]);

  return (
    <section id="hero" ref={trackRef} data-testid="hero-section" className="relative md:h-[260vh]">
      {/* Desktop pinned stage */}
      <div className="hidden md:block sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleFilter }}
          className="absolute inset-x-0 bottom-[9vh] text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease }}
            className="flex items-center justify-center gap-2.5 font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[color:var(--ink-faint)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#46c589] lucy-blink" />
            Dexalab presents · Preview build
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.7, ease }}
            data-testid="hero-title"
            className="mt-4 font-heading font-black tracking-tighter leading-none text-7xl lg:text-8xl"
          >
            <span className="text-[color:var(--ink)]">Meet </span>
            <span className="text-iris-gradient">Lucy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.1, ease }}
            className="mt-5 text-lg text-[color:var(--ink-soft)]"
          >
            A companion who sees, hears and plays along — on your own hardware.
          </motion.p>
        </motion.div>

        <motion.div
          style={{ opacity: tag1Opacity, y: tag1Y }}
          className="absolute inset-x-0 top-[12vh] text-center px-6"
        >
          <p className="font-heading text-4xl lg:text-5xl font-bold tracking-tight text-[color:var(--ink)]">
            She sees you. <span className="text-[color:var(--ink-faint)]">She plays along.</span>
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: tag2Opacity, x: tag2X }}
          className="absolute left-[8vw] top-1/2 -translate-y-1/2 max-w-md"
        >
          <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[color:var(--pulse)]">
            Not a chatbot
          </div>
          <p className="mt-4 font-heading text-4xl font-bold tracking-tight leading-tight text-[color:var(--ink)]">
            A companion,
            <br />
            not a text box.
          </p>
          <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed">
            Voice, vision, memory and play — wrapped in one character who reacts like she&apos;s
            actually there. Keep scrolling; she&apos;ll show you.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 inset-x-0 flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            data-testid="hero-scroll-cue"
            className="flex flex-col items-center gap-2 text-[color:var(--ink-faint)]"
          >
            <span className="font-mono-ui text-[9px] tracking-[0.3em] uppercase">Scroll</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile hero — no pinning, Lucy inline */}
      <div className="md:hidden min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.img
            src="/lucy/wave.png"
            alt="Lucy waving"
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease }}
            className="h-[44vh] w-auto drop-shadow-[0_18px_36px_rgba(97,84,140,0.28)]"
            data-testid="hero-lucy-mobile"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.4, ease }}
          className="mt-8 font-heading font-black tracking-tighter leading-none text-6xl"
        >
          <span className="text-[color:var(--ink)]">Meet </span>
          <span className="text-iris-gradient">Lucy</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="mt-4 max-w-sm text-[color:var(--ink-soft)] leading-relaxed"
        >
          A companion who sees, hears and plays along — running on your own hardware.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Camera, Mic, ArrowDown, ScanLine } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

const ease = [0.22, 1, 0.36, 1];

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const chatY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const chatOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

  return (
    <section
      id="hero"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-36 pb-20"
    >
      <motion.img
        src="/lucy/wave.png"
        alt="Lucy waving"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="md:hidden h-36 w-auto mb-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        data-testid="hero-lucy-mobile"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="flex items-center gap-2.5 font-mono-ui text-[10px] tracking-[0.3em] uppercase text-zinc-400"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#d91636] lucy-blink" />
        Dexalab presents · Preview build
      </motion.div>

      <h1 className="mt-8 text-center font-heading font-black tracking-tighter leading-[0.98] text-5xl sm:text-6xl lg:text-7xl max-w-5xl">
        <Line words={["The", "future", "of"]} startDelay={0.1} />
        <Line words={["AI", "companions"]} startDelay={0.34} gradient />
        <Line words={["is", "here."]} startDelay={0.5} />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.75, ease }}
        className="mt-7 max-w-xl text-center text-base sm:text-lg text-zinc-400 leading-relaxed"
      >
        Meet <span className="text-white font-semibold">Lucy</span> — she sees, hears and speaks.
        A living, animated companion that runs entirely on{" "}
        <span className="text-white font-semibold">your own hardware</span>.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease }}
        className="mt-9 w-full max-w-md"
      >
        <WaitlistForm source="hero" />
      </motion.div>

      <motion.div
        style={{ y: chatY, opacity: chatOpacity }}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 1.05, ease }}
        className="mt-16 w-full max-w-lg"
      >
        <ChatSequence />
      </motion.div>

      <motion.button
        onClick={() => document.querySelector("#capabilities")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        data-testid="hero-scroll-cue"
        className="mt-14 flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <span className="font-mono-ui text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
};

const Line = ({ words, startDelay, gradient = false }) => (
  <span className="block">
    {words.map((w, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 44, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: startDelay + i * 0.09, ease }}
        className={`inline-block mr-[0.22em] ${gradient ? "text-accent-gradient" : "text-white"}`}
      >
        {w}
      </motion.span>
    ))}
  </span>
);

const TIMINGS = [900, 1300, 1500, 1900, 2100, 4200];

const ChatSequence = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % TIMINGS.length), TIMINGS[step]);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      data-testid="hero-chat-demo"
      className="glass rounded-3xl p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(217,22,54,0.06)]"
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#d91636] lucy-blink" />
          <span className="font-mono-ui text-[10px] tracking-[0.25em] uppercase text-zinc-300">
            Lucy · Live
          </span>
        </div>
        <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-zinc-500">
          Local · 0 cloud calls
        </span>
      </div>

      <div className="min-h-[230px] flex flex-col justify-end gap-3 pt-4">
        <AnimatePresence>
          {step >= 1 && (
            <Bubble key="u1" role="user">Hey Lucy — what am I holding?</Bubble>
          )}
          {step === 2 && (
            <Bubble key="typing" role="lucy">
              <span className="inline-flex gap-1 items-center py-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    className="h-1.5 w-1.5 rounded-full bg-[#d91636]"
                  />
                ))}
              </span>
            </Bubble>
          )}
          {step >= 3 && (
            <Bubble key="l1" role="lucy" tag="VISION">
              Accessing your camera…
              {step === 3 && (
                <div className="relative mt-2 h-14 rounded-xl border border-[#d91636]/30 overflow-hidden bg-black/40">
                  <div className="lucy-scan-line absolute left-0 right-0 h-px bg-[#d91636] shadow-[0_0_12px_rgba(217,22,54,0.9)]" />
                  <span className="absolute bottom-1.5 left-2.5 font-mono-ui text-[9px] tracking-[0.2em] uppercase text-[#d91636]/80 flex items-center gap-1.5">
                    <ScanLine className="h-3 w-3" /> Analyzing frame…
                  </span>
                </div>
              )}
            </Bubble>
          )}
          {step >= 4 && (
            <Bubble key="l2" role="lucy">
              That&apos;s a <span className="text-white font-semibold">Raspberry Pi 5</span> — want
              me to walk you through the setup?
            </Bubble>
          )}
          {step >= 5 && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-1"
            >
              <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[#f01e42]">
                Lucy is speaking
              </span>
              <span className="flex items-end gap-[3px] h-5">
                {Array.from({ length: 22 }).map((_, i) => (
                  <span
                    key={i}
                    className="lucy-bar w-[3px] rounded-full bg-gradient-to-t from-[#d91636] to-[#b9a2c2]"
                    style={{ height: `${8 + ((i * 13) % 12)}px`, animationDelay: `${(i % 8) * 0.08}s` }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-2.5">
        <span className="text-[12px] text-zinc-500">
          Type or hold space to talk<span className="lucy-caret" />
        </span>
        <div className="ml-auto flex items-center gap-3 text-zinc-500">
          <Camera className="h-3.5 w-3.5" />
          <Mic className="h-3.5 w-3.5 text-[#d91636]" />
        </div>
      </div>
    </motion.div>
  );
};

const Bubble = ({ role, tag, children }) => {
  const isLucy = role === "lucy";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease }}
      className={`flex ${isLucy ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
          isLucy
            ? "bg-[#d91636]/[0.10] border border-[#d91636]/25 text-zinc-100 rounded-bl-md"
            : "bg-white/[0.06] border border-white/[0.12] text-white rounded-br-md"
        }`}
      >
        {tag && (
          <span className="block font-mono-ui text-[8px] tracking-[0.3em] uppercase text-[#d91636] mb-1">
            {tag}
          </span>
        )}
        {children}
      </div>
    </motion.div>
  );
};

export default Hero;

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";

const POSES = {
  base: "/lucy/base.png",
  wave: "/lucy/wave.png",
  point: "/lucy/point.png",
  excited: "/lucy/excited.png",
  shush: "/lucy/shush.png",
  thumbs: "/lucy/thumbs.png",
};

const SECTIONS = [
  { id: "hero", pose: "wave", side: "right", scale: 1, line: "Hi! I'm Lucy — welcome to my little corner of the net." },
  { id: "capabilities", pose: "point", side: "right", scale: 0.92, line: "Everything I can do — voice, vision, memory. All me." },
  { id: "emotions", pose: "excited", side: "left", scale: 0.82, line: "My favourite part — I actually feel this stuff!" },
  { id: "privacy", pose: "shush", side: "right", scale: 0.9, line: "What happens on your device… stays on your device." },
  { id: "join", pose: "thumbs", side: "left", scale: 0.95, line: "Save your spot — I'll remember you were early." },
  { id: "faq", pose: "base", side: "right", scale: 0.85, line: "Questions? I've heard them all." },
];

const Typewriter = ({ text }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const iv = setInterval(() => setN((v) => (v < text.length ? v + 1 : v)), 22);
    return () => clearInterval(iv);
  }, [text]);
  return <>{text.slice(0, n)}</>;
};

const LucyPresenter = () => {
  const [active, setActive] = useState(0);
  const cfg = SECTIONS[active];

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const rotateRaw = useTransform(velocity, [-1600, 1600], [7, -7]);
  const rotate = useSpring(rotateRaw, { stiffness: 130, damping: 18 });

  useEffect(() => {
    Object.values(POSES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      data-testid="lucy-presenter"
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden hidden md:block"
      aria-hidden
    >
      <motion.div
        initial={false}
        animate={{ left: cfg.side === "right" ? "84%" : "1.5%", scale: cfg.scale }}
        transition={{ type: "spring", stiffness: 55, damping: 15 }}
        style={{ transformOrigin: "bottom center" }}
        className="absolute bottom-0 w-[180px] xl:w-[215px]"
      >
        <motion.div style={{ rotate }} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={cfg.id}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              data-testid="lucy-speech-bubble"
              className={`absolute bottom-[101%] mb-1 w-[225px] glass !bg-black/70 rounded-2xl px-4 py-3 ${
                cfg.side === "right" ? "right-[35%] rounded-br-sm" : "left-[35%] rounded-bl-sm"
              }`}
            >
              <span className="font-mono-ui text-[8px] tracking-[0.3em] uppercase text-[#F01E42] block mb-1">
                Lucy
              </span>
              <p className="text-[12px] leading-snug text-white/90">
                <Typewriter text={cfg.line} />
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={cfg.pose}
                src={POSES[cfg.pose]}
                alt="Lucy"
                initial={{ opacity: 0, y: 26, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="w-full drop-shadow-[0_24px_44px_rgba(0,0,0,0.65)]"
              />
            </AnimatePresence>
          </motion.div>
          <div className="mx-auto -mt-2 h-3 w-2/3 rounded-full bg-black/70 blur-md" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LucyPresenter;

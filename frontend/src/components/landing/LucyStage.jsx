import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import LucySprite from "./LucySprite";

/*
 * LucyStage — one persistent, fixed-position Lucy for the whole page.
 * She never unmounts: the hero half-body reveal, the drop to full body,
 * the dock beside each capability panel and the center-stage "alive"
 * moment are all the same element, so every move is continuous.
 *
 * Position/scale are MotionValues. During the hero act they're scrubbed
 * directly by scroll progress (reversible); afterwards each section
 * "beat" springs them to a new arrangement via IntersectionObserver.
 *
 * Sections can interrupt with window events:
 *   lucy:state     { pose, halo }  — honored during the "emotions" beat
 *   lucy:celebrate                 — brief excited flash (waitlist success)
 */

const SPRING = { type: "spring", stiffness: 56, damping: 17, mass: 0.9 };

/* Piecewise-linear interpolation over sorted stops. */
const interp = (v, stops, values) => {
  if (v <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i += 1) {
    if (v <= stops[i]) {
      const t = (v - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + t * (values[i] - values[i - 1]);
    }
  }
  return values[values.length - 1];
};

const HALOS = {
  pink: "rgba(247, 206, 220, 0.9)",
  blue: "rgba(201, 220, 242, 0.9)",
  lilac: "rgba(220, 210, 244, 0.9)",
  mint: "rgba(207, 238, 223, 0.9)",
};

/* x in vw from center, scale relative to the 84vh sprite box */
const BEATS = {
  hero: { x: 0, scale: 1.9, pose: "wave", halo: "pink", opacity: 1 },
  see: { x: 21, scale: 0.8, pose: "point", halo: "blue", opacity: 1 },
  hear: { x: 21, scale: 0.84, pose: "base", halo: "lilac", opacity: 1 },
  play: { x: 21, scale: 0.87, pose: "excited", halo: "pink", opacity: 1 },
  emotions: { x: 0, scale: 1.02, pose: "excited", halo: "pink", opacity: 1 },
  privacy: { x: 21, scale: 0.78, pose: "shush", halo: "blue", opacity: 1 },
  join: { x: 21, scale: 0.86, pose: "thumbs", halo: "mint", opacity: 1 },
  faq: { x: 21, scale: 0.8, pose: "thumbs", halo: "mint", opacity: 0 },
};

const BEAT_IDS = ["see", "hear", "play", "emotions", "privacy", "join", "faq"];

const LucyStage = ({ heroTrackRef }) => {
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState("hero");
  const [pose, setPose] = useState("wave");
  const [halo, setHalo] = useState("pink");
  const beatRef = useRef("hero");
  const celebrating = useRef(false);
  const emotionState = useRef(null);

  const xVw = useMotionValue(0);
  const scaleMv = useMotionValue(1.9);
  const opacityMv = useMotionValue(1);
  const maskMv = useMotionValue(36);

  /* Hero scrub — driven off the global scroll position against the hero
     track's measured geometry (the track is owned by Hero.jsx, so
     target-based useScroll can't be trusted to re-measure here). */
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (yPx) => {
    if (beatRef.current !== "hero") return;
    const el = heroTrackRef.current;
    if (!el) return;
    const denom = Math.max(el.offsetHeight - window.innerHeight, 1);
    const p = Math.min(1, Math.max(0, (yPx - el.offsetTop) / denom));
    scaleMv.set(interp(p, [0.06, 0.46, 0.72, 0.98], [1.9, 1, 1, 0.8]));
    xVw.set(interp(p, [0, 0.72, 0.98], [0, 0, 21]));
    maskMv.set(interp(p, [0.08, 0.44], [36, 112]));
    opacityMv.set(1);
    if (!celebrating.current) setPose(p < 0.32 ? "wave" : "base");
    setHalo("pink");
  });

  useEffect(() => {
    const observers = [];
    const spot = (id, onEnter) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && onEnter(),
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    };
    BEAT_IDS.forEach((id) => spot(id, () => setBeat(id)));
    spot("hero", () => setBeat("hero"));
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    beatRef.current = beat;
    if (beat === "hero") return;
    const cfg = BEATS[beat];
    const opts = reduced ? { duration: 0 } : SPRING;
    animate(xVw, cfg.x, opts);
    animate(scaleMv, cfg.scale, opts);
    animate(maskMv, 112, opts);
    animate(opacityMv, cfg.opacity, reduced ? { duration: 0 } : { duration: 0.8 });
    const state = beat === "emotions" && emotionState.current ? emotionState.current : cfg;
    if (!celebrating.current) setPose(state.pose);
    setHalo(state.halo);
  }, [beat, reduced, xVw, scaleMv, maskMv, opacityMv]);

  useEffect(() => {
    const onState = (e) => {
      if (!e.detail?.pose) return;
      emotionState.current = e.detail;
      if (beatRef.current !== "emotions" || celebrating.current) return;
      setPose(e.detail.pose);
      if (e.detail.halo) setHalo(e.detail.halo);
    };
    const onCelebrate = () => {
      celebrating.current = true;
      setPose("excited");
      setTimeout(() => {
        celebrating.current = false;
        const b = beatRef.current;
        if (b === "hero") setPose("base");
        else if (b === "emotions" && emotionState.current) setPose(emotionState.current.pose);
        else setPose(BEATS[b].pose);
      }, 2600);
    };
    window.addEventListener("lucy:state", onState);
    window.addEventListener("lucy:celebrate", onCelebrate);
    return () => {
      window.removeEventListener("lucy:state", onState);
      window.removeEventListener("lucy:celebrate", onCelebrate);
    };
  }, []);

  const velocity = useVelocity(scrollY);
  const leanRaw = useTransform(velocity, [-1600, 1600], [2.6, -2.6]);
  const lean = useSpring(leanRaw, { stiffness: 120, damping: 19 });

  const x = useMotionTemplate`${xVw}vw`;
  const maskEnd = useTransform(maskMv, (v) => v + 16);
  const mask = useMotionTemplate`linear-gradient(to bottom, black ${maskMv}%, transparent ${maskEnd}%)`;
  const shadowOpacity = useTransform(maskMv, [92, 112], [0, 0.45]);
  const haloScale = beat === "emotions" ? 1.25 : 1;

  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden hidden md:block"
      aria-hidden
      data-testid="lucy-stage"
    >
      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ x, scale: scaleMv, rotate: reduced ? 0 : lean, opacity: opacityMv }}
          className="absolute left-0 right-0 top-[6vh] mx-auto h-[84vh] w-[58vh] origin-top"
        >
          <motion.div style={{ maskImage: mask, WebkitMaskImage: mask }} className="relative h-full w-full">
            {Object.entries(HALOS).map(([name, color]) => (
              <motion.div
                key={name}
                className="absolute left-1/2 top-[8%] h-[72%] w-[130%] -translate-x-1/2 rounded-full"
                style={{
                  background: `radial-gradient(ellipse at center, ${color} 0%, transparent 62%)`,
                  filter: "blur(48px)",
                }}
                animate={{ opacity: halo === name ? (beat === "emotions" ? 0.95 : 0.6) : 0, scale: haloScale }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            ))}

            <motion.div
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6.1, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <motion.div
                animate={reduced ? undefined : { rotate: [-0.35, 0.35, -0.35] }}
                transition={{ duration: 8.3, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full"
              >
                <motion.div
                  animate={reduced ? undefined : { scale: [1, 1.007, 1] }}
                  transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-full origin-bottom"
                >
                  <LucySprite
                    pose={pose}
                    className="h-full w-full drop-shadow-[0_18px_36px_rgba(97,84,140,0.28)]"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity: shadowOpacity }}
            className="absolute -bottom-[1.5vh] left-1/2 h-[2.6vh] w-[52%] -translate-x-1/2 rounded-full bg-[#6f677f] blur-xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LucyStage;

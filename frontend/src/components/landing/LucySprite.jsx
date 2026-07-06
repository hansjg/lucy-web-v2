import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LUCY_POSES from "./lucyPoses";

/*
 * LucySprite — Lucy's appearance, fully isolated from choreography.
 * Today it crossfades static PNGs. Swap a pose for a .gif/.webp in
 * lucyPoses.js and it plays with zero changes here; replace this
 * component's internals for a full rig. See lucyPoses.js for details.
 *
 * The parent controls size (height) and position; this component fills it.
 */

const CROSSFADE = 0.45;

const LucySprite = ({ pose = "base", className = "" }) => {
  const cfg = LUCY_POSES[pose] || LUCY_POSES.base;
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    Object.values(LUCY_POSES).forEach((p) => {
      new Image().src = p.src;
      if (p.blink) new Image().src = p.blink;
    });
  }, []);

  useEffect(() => {
    if (!cfg.blink) return undefined;
    let open;
    let close;
    let cancelled = false;
    const loop = () => {
      close = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        open = setTimeout(() => {
          if (cancelled) return;
          setBlinking(false);
          loop();
        }, 130);
      }, 3200 + Math.random() * 3600);
    };
    loop();
    return () => {
      cancelled = true;
      clearTimeout(open);
      clearTimeout(close);
      setBlinking(false);
    };
  }, [cfg.blink]);

  return (
    <div className={`relative ${className}`} data-testid="lucy-sprite">
      <AnimatePresence initial={false}>
        <motion.img
          key={pose}
          src={cfg.src}
          alt="Lucy"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: blinking && cfg.blink ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CROSSFADE, ease: [0.33, 1, 0.68, 1] }}
          className="absolute bottom-0 left-1/2 h-full w-auto max-w-none select-none"
          style={{ x: `${-(cfg.anchor * 100)}%` }}
        />
      </AnimatePresence>
      {cfg.blink && (
        <img
          src={cfg.blink}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute bottom-0 left-1/2 h-full w-auto max-w-none select-none"
          style={{
            transform: `translateX(${-(cfg.anchor * 100)}%)`,
            opacity: blinking ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

export default LucySprite;

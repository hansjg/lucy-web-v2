import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Cpu, Brain, Sparkles, ScanLine, Mic } from "lucide-react";

const spring = { type: "spring", stiffness: 66, damping: 19 };
const ease = [0.22, 1, 0.36, 1];

/*
 * Three full-height panels Lucy "presents" from her dock on the right.
 * Each panel embeds a looping simulation of the chatbot actually being
 * used — the loop runs only while the card is in view and resets when
 * it leaves, so it always replays from the top.
 */

/* Advance through `timings` (ms per step) while visible; reset off-screen. */
const useLoop = (timings, inView) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) {
      setStep(0);
      return undefined;
    }
    const t = setTimeout(() => setStep((s) => (s + 1) % timings.length), timings[step]);
    return () => clearTimeout(t);
  }, [step, inView, timings]);
  return step;
};

const Typewriter = ({ text, speed = 26 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const iv = setInterval(() => setN((v) => (v < text.length ? v + 1 : v)), speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <>{text.slice(0, n)}</>;
};

const TypingDots = () => (
  <span className="inline-flex gap-1 items-center py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        className="h-1.5 w-1.5 rounded-full bg-[color:var(--pulse)]"
      />
    ))}
  </span>
);

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
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed text-[color:var(--ink)] ${
          isLucy
            ? "bg-[color:var(--pulse-soft)] border border-[#6c4cf1]/20 rounded-bl-md"
            : "bg-white/70 border border-[color:var(--glass-border)] rounded-br-md"
        }`}
      >
        {tag && (
          <span className="block font-mono-ui text-[8px] tracking-[0.3em] uppercase text-[color:var(--pulse)] mb-1">
            {tag}
          </span>
        )}
        {children}
      </div>
    </motion.div>
  );
};

/* ---- Vision: "lucy, can you see this?" → scan → reaction ---- */

const VISION_TIMINGS = [600, 1500, 1000, 2800, 3200, 1700];

const SimVision = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useLoop(VISION_TIMINGS, inView);

  return (
    <div ref={ref} data-testid="sim-vision" className="glass rounded-3xl p-5">
      <div className="min-h-[290px] flex flex-col justify-end gap-2.5">
        <AnimatePresence>
          {step >= 1 && (
            <Bubble key="u1" role="user">
              lucy, can you see this? what&apos;s this?
            </Bubble>
          )}
          {step === 2 && (
            <Bubble key="typing" role="lucy">
              <TypingDots />
            </Bubble>
          )}
          {step >= 3 && (
            <Bubble key="scan" role="lucy" tag="Vision">
              let me look…
              <div className="relative mt-2 h-20 w-56 max-w-full rounded-xl border border-[#6c4cf1]/25 overflow-hidden bg-white/70">
                <div className="absolute inset-2 border border-dashed border-[color:var(--ink-faint)]/40 rounded-lg" />
                {step === 3 ? (
                  <>
                    <div className="lucy-scan-line absolute left-0 right-0 h-px bg-[color:var(--pulse)] shadow-[0_0_12px_rgba(108,76,241,0.8)]" />
                    <span className="absolute bottom-1.5 left-2.5 font-mono-ui text-[9px] tracking-[0.2em] uppercase text-[color:var(--pulse)] flex items-center gap-1.5">
                      <ScanLine className="h-3 w-3" /> analyzing frame…
                    </span>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease }}
                      className="absolute left-[30%] top-[22%] h-[52%] w-[38%] rounded-md border-2 border-[color:var(--pulse)]"
                    />
                    <span className="absolute bottom-1.5 left-2.5 font-mono-ui text-[9px] tracking-[0.2em] uppercase text-[color:var(--pulse)]">
                      raspberry_pi_5 · 98.2%
                    </span>
                  </>
                )}
              </div>
            </Bubble>
          )}
          {step >= 4 && (
            <Bubble key="react" role="lucy">
              ooh — that&apos;s a <span className="font-semibold">Raspberry Pi 5</span>! are we
              finally building the robot? please say yes.
            </Bubble>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[color:var(--glass-border)] pt-3">
        <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
          camera · on-device
        </span>
        <span className="flex items-center gap-1.5 font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[#2f9e6b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#46c589] lucy-blink" />
          live
        </span>
      </div>
    </div>
  );
};

/* ---- Voice: you speak, she answers — both transcribed live ---- */

const VOICE_TIMINGS = [800, 2600, 900, 3400, 1600];

const Wave = ({ active, color, bars = 26 }) => (
  <div className="flex items-end gap-[3px] h-12">
    {Array.from({ length: bars }).map((_, i) => (
      <span
        key={i}
        className={`w-[3.5px] rounded-full ${active ? "lucy-bar" : ""}`}
        style={{
          height: active ? `${10 + ((i * 17) % 30)}px` : "4px",
          animationDelay: `${(i % 9) * 0.09}s`,
          background: color,
          opacity: active ? 1 : 0.35,
          transition: "height 0.4s, opacity 0.4s",
        }}
      />
    ))}
  </div>
);

const SimVoice = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useLoop(VOICE_TIMINGS, inView);

  const phase = step === 1 ? "you" : step >= 3 ? "lucy" : "idle";

  return (
    <div ref={ref} data-testid="sim-voice" className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <span
          className={`flex items-center gap-2 font-mono-ui text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
            phase === "lucy"
              ? "text-[#2f9e6b]"
              : phase === "you"
              ? "text-[color:var(--ink-soft)]"
              : "text-[color:var(--ink-faint)]"
          }`}
        >
          <Mic className="h-3 w-3" />
          {phase === "lucy" ? "lucy is speaking" : phase === "you" ? "you're speaking" : "listening…"}
        </span>
        <AnimatePresence>
          {phase === "lucy" && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]"
            >
              latency 118 ms
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <Wave
          active={phase !== "idle" && step !== 2}
          color={phase === "lucy" ? "linear-gradient(to top, #6c4cf1, #a78bfa)" : "#a79fba"}
        />
      </div>

      <div className="mt-4 min-h-[64px] text-[13px] leading-relaxed text-[color:var(--ink)]">
        {step === 1 && (
          <p>
            <span className="font-mono-ui text-[8px] tracking-[0.3em] uppercase text-[color:var(--ink-faint)] block mb-1">
              You
            </span>
            <Typewriter text="lucy, what should we watch tonight?" />
          </p>
        )}
        {step === 2 && <TypingDots />}
        {step >= 3 && (
          <p>
            <span className="font-mono-ui text-[8px] tracking-[0.3em] uppercase text-[color:var(--pulse)] block mb-1">
              Lucy
            </span>
            <Typewriter text="something cozy — you always fall asleep during thrillers anyway." />
          </p>
        )}
      </div>
    </div>
  );
};

/* ---- Play: the guessing game, scored live ---- */

const PLAY_TIMINGS = [700, 1500, 1000, 1900, 2200, 2100];

const SimPlay = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useLoop(PLAY_TIMINGS, inView);

  return (
    <div ref={ref} data-testid="sim-play" className="glass rounded-3xl p-5">
      <div className="min-h-[210px] flex flex-col justify-end gap-2.5">
        <AnimatePresence>
          {step >= 1 && (
            <Bubble key="u1" role="user">
              okay — guess what i&apos;m holding
            </Bubble>
          )}
          {step === 2 && (
            <Bubble key="typing" role="lucy">
              <TypingDots />
            </Bubble>
          )}
          {step >= 3 && (
            <Bubble key="l1" role="lucy">
              cables… again? wait — tilt it toward the camera.
            </Bubble>
          )}
          {step >= 4 && (
            <Bubble key="l2" role="lucy">
              the Pi! that&apos;s my point. we&apos;re building tonight.
            </Bubble>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[color:var(--glass-border)] pt-3">
        <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
          guessing game · round 8
        </span>
        <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--pulse)]">
          you 3 ·{" "}
          <motion.span
            key={step >= 5 ? "6" : "5"}
            initial={step >= 5 ? { scale: 1.6, opacity: 0.4 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className="inline-block"
          >
            lucy {step >= 5 ? 6 : 5}
          </motion.span>
        </span>
      </div>
    </div>
  );
};

/* ---- Panels ---- */

const Panel = ({ id, index, label, title, body, poseImg, children, testId }) => (
  <section id={id} data-testid={testId} className="relative min-h-screen flex items-center">
    <motion.div
      initial={{ opacity: 0, x: -70, rotate: -1.2 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ amount: 0.35 }}
      transition={spring}
      className="w-full md:w-[46%] px-6 md:pl-[6vw] lg:pl-[8vw] md:pr-0 py-20"
    >
      <img
        src={poseImg}
        alt=""
        aria-hidden
        className="md:hidden h-36 w-auto mx-auto mb-8 drop-shadow-[0_14px_28px_rgba(97,84,140,0.25)]"
      />
      <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[color:var(--pulse)]">
        {label}
      </div>
      <h2 className="font-heading mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-[color:var(--ink)]">
        {title}
      </h2>
      <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed max-w-md">{body}</p>
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.35 }}
        transition={{ ...spring, delay: 0.12 }}
        className="mt-8"
      >
        {children}
      </motion.div>
      <div className="mt-6 font-mono-ui text-[9px] tracking-[0.3em] uppercase text-[color:var(--ink-faint)]">
        {String(index).padStart(2, "0")} / 03
      </div>
    </motion.div>
  </section>
);

const Capabilities = () => (
  <div id="capabilities" data-testid="capabilities-section" className="relative">
    <Panel
      id="see"
      index={1}
      testId="capability-panel-vision"
      label="// 01 · Vision"
      title="She sees what you see"
      body="Point your camera at anything — a gadget, a sketch, the mess on your desk. Lucy reads the frame in real time, on-device. No upload, no cloud."
      poseImg="/lucy/point.png"
    >
      <SimVision />
    </Panel>

    <Panel
      id="hear"
      index={2}
      testId="capability-panel-voice"
      label="// 02 · Voice"
      title="Talk. She talks back."
      body="Streaming speech-to-text in, expressive neural voice out. Conversations flow at the speed of speech — interruptions, laughter and all."
      poseImg="/lucy/base.png"
    >
      <SimVoice />
    </Panel>

    <Panel
      id="play"
      index={3}
      testId="capability-panel-play"
      label="// 03 · Play"
      title="She plays along"
      body="Deal her into your card game, quiz her on your screen, hand her a riddle. Lucy isn't a Q&A box — she banters, bluffs and keeps score."
      poseImg="/lucy/excited.png"
    >
      <SimPlay />
    </Panel>

    <section className="relative py-10 pb-28">
      <div className="px-6 md:pl-[6vw] lg:pl-[8vw] md:max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Cpu, t: "Local-first", d: "GGUF, ONNX or MLX — she runs on your rig." },
            { icon: Brain, t: "Long memory", d: "Your projects, your tone, across sessions." },
            { icon: Sparkles, t: "Emotion engine", d: "Moods that move — see it below." },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...spring, delay: i * 0.09 }}
              data-testid={`capability-mini-${i}`}
              className="glass rounded-2xl p-5"
            >
              <c.icon className="h-4.5 w-4.5 text-[color:var(--pulse)]" size={18} />
              <div className="font-heading mt-3 text-base font-bold text-[color:var(--ink)]">{c.t}</div>
              <p className="mt-1 text-[13px] text-[color:var(--ink-soft)] leading-relaxed">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Capabilities;

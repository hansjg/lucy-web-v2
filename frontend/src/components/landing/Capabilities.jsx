import React from "react";
import { motion } from "framer-motion";
import { Eye, AudioLines, Gamepad2, Cpu, Brain, Sparkles } from "lucide-react";

const spring = { type: "spring", stiffness: 66, damping: 19 };

/*
 * Three full-height panels Lucy "presents" from her dock on the right.
 * Each panel slides in from the left as she gestures toward it
 * (LucyStage swaps her pose via the section ids: see / hear / play).
 */

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
      <div className="glass rounded-3xl p-4">
        <div className="relative h-36 rounded-2xl overflow-hidden bg-white/70 border border-[color:var(--glass-border)]">
          <div className="absolute inset-3 border border-dashed border-[color:var(--ink-faint)]/40 rounded-xl" />
          <div className="lucy-scan-line absolute left-0 right-0 h-px bg-[color:var(--pulse)] shadow-[0_0_14px_rgba(108,76,241,0.7)]" />
          <div className="absolute bottom-3 left-4 font-mono-ui text-[10px] tracking-[0.2em] uppercase text-[color:var(--pulse)]">
            object: raspberry_pi_5 · 98.2%
          </div>
          <div className="absolute top-3 right-4 flex items-center gap-1.5 font-mono-ui text-[9px] tracking-[0.2em] uppercase text-[color:var(--ink-faint)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#46c589] lucy-blink" />
            live
          </div>
        </div>
      </div>
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
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[#2f9e6b]">
            Lucy is speaking
          </span>
          <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
            latency 118 ms
          </span>
        </div>
        <div className="mt-4 flex items-end gap-[4px] h-16">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="lucy-bar w-[4px] rounded-full"
              style={{
                height: `${14 + ((i * 17) % 42)}px`,
                animationDelay: `${(i % 9) * 0.09}s`,
                background: "linear-gradient(to top, #6c4cf1, #a78bfa)",
              }}
            />
          ))}
        </div>
      </div>
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
      <div className="glass rounded-3xl p-5 space-y-3">
        <ChatLine who="you" text="okay — guess what I'm holding" />
        <ChatLine who="lucy" text="cables… again? wait, tilt it — that's the Pi! we're building tonight." />
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
            guessing game · round 8
          </span>
          <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--pulse)]">
            you 3 · lucy 5
          </span>
        </div>
      </div>
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

const ChatLine = ({ who, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ amount: 0.6 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`flex ${who === "lucy" ? "justify-start" : "justify-end"}`}
  >
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
        who === "lucy"
          ? "bg-[color:var(--pulse-soft)] border border-[#6c4cf1]/20 text-[color:var(--ink)] rounded-bl-md"
          : "bg-white/70 border border-[color:var(--glass-border)] text-[color:var(--ink)] rounded-br-md"
      }`}
    >
      {text}
    </div>
  </motion.div>
);

export default Capabilities;

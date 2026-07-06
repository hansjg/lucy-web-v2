import React from "react";
import { motion } from "framer-motion";
import { Eye, AudioLines, Cpu, Sparkles, Brain } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const Card = ({ span, icon: Icon, label, title, body, children, testId, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay: i * 0.08, ease }}
    whileHover={{ y: -6 }}
    data-testid={testId}
    className={`${span} group relative glass rounded-3xl p-7 overflow-hidden transition-colors duration-500 hover:border-[#d91636]/30`}
  >
    <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#d91636]/[0.07] blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center h-10 w-10 rounded-2xl bg-white/[0.05] border border-white/10 text-[#d91636]">
          <Icon className="h-4.5 w-4.5" size={18} />
        </span>
        <span className="font-mono-ui text-[9px] tracking-[0.3em] uppercase text-zinc-500">
          {label}
        </span>
      </div>
      <h3 className="font-heading mt-5 text-2xl font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed max-w-md">{body}</p>
      {children}
    </div>
  </motion.div>
);

const Capabilities = () => (
  <section id="capabilities" data-testid="capabilities-section" className="relative py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="max-w-2xl"
      >
        <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[#d91636]">
          // Capabilities
        </div>
        <h2 className="font-heading mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Everything a companion <span className="text-gradient">should be</span>.
        </h2>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Voice, vision, memory and local execution — stacked under one animated character that
          never feels like a UI.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card
          i={0}
          span="md:col-span-8"
          icon={Eye}
          label="Image recognition"
          title="She sees what you see"
          body="Show Lucy a photo, a screenshot, or whatever is in your hand. Real-time vision that reads the room — no upload, no cloud."
          testId="capability-card-vision"
        >
          <div className="relative mt-6 h-32 rounded-2xl border border-[#d91636]/20 bg-black/40 overflow-hidden">
            <div className="absolute inset-3 border border-dashed border-white/10 rounded-xl" />
            <div className="lucy-scan-line absolute left-0 right-0 h-px bg-[#d91636]/80 shadow-[0_0_16px_rgba(0,240,255,0.8)]" />
            <div className="absolute bottom-3 left-4 font-mono-ui text-[10px] tracking-[0.2em] uppercase text-[#d91636]/90">
              object: raspberry_pi_5 · 98.2%
            </div>
            <div className="absolute top-3 right-4 font-mono-ui text-[9px] tracking-[0.2em] uppercase text-zinc-500">
              frame 0424 · live
            </div>
          </div>
        </Card>

        <Card
          i={1}
          span="md:col-span-4"
          icon={AudioLines}
          label="TTS · STT"
          title="Voice, both ways"
          body="Talk to her, she talks back. Streaming speech-to-text and expressive neural voice."
          testId="capability-card-voice"
        >
          <div className="mt-6 flex items-end gap-[4px] h-16">
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                className="lucy-bar w-[4px] rounded-full bg-gradient-to-t from-[#d91636]/80 to-[#b9a2c2]/80"
                style={{ height: `${14 + ((i * 17) % 40)}px`, animationDelay: `${(i % 9) * 0.09}s` }}
              />
            ))}
          </div>
        </Card>

        <Card
          i={2}
          span="md:col-span-5"
          icon={Cpu}
          label="Local first"
          title="Runs on your rig"
          body="Bring your own model — GGUF, ONNX or MLX. Lucy lives on your machine, not someone's server."
          testId="capability-card-local"
        >
          <div className="mt-6 rounded-2xl bg-black/50 border border-white/[0.07] p-4 font-mono-ui text-[11px] leading-relaxed">
            <div className="text-zinc-500">$ lucy --start --local --gpu</div>
            <div className="text-zinc-400">› loading lucy-77b (q4_K_M)… ok</div>
            <div className="text-[#f01e42]">› cloud dependencies: 0</div>
            <div className="text-[#d91636]">
              › ready on localhost<span className="lucy-caret" />
            </div>
          </div>
        </Card>

        <Card
          i={3}
          span="md:col-span-4"
          icon={Sparkles}
          label="Emotion engine"
          title="She reacts"
          body="Smooth transitions between joy, curiosity and focus — with gestures that point at what matters."
          testId="capability-card-emotion"
        >
          <div className="mt-6 flex items-center gap-4">
            {["#e8b44a", "#b9a2c2", "#d91636"].map((c, i) => (
              <motion.span
                key={c}
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 }}
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: c, boxShadow: `0 0 16px ${c}66` }}
              />
            ))}
            <span className="font-mono-ui text-[9px] tracking-[0.25em] uppercase text-zinc-500">
              joy · curiosity · surprise
            </span>
          </div>
        </Card>

        <Card
          i={4}
          span="md:col-span-3"
          icon={Brain}
          label="Long memory"
          title="She remembers"
          body="Persistent context across sessions — your projects, your tone, your preferences."
          testId="capability-card-memory"
        />
      </div>
    </div>
  </section>
);

export default Capabilities;

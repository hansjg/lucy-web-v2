import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, WifiOff, HardDrive } from "lucide-react";

const TEXTURE =
  "https://images.unsplash.com/photo-1762281749806-213ae55fef28?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920";

const statement = "Private, local AI that sees, hears and speaks.";

const stats = [
  { icon: ShieldCheck, k: "Cloud dependencies", v: "0" },
  { icon: WifiOff, k: "Outbound calls", v: "0" },
  { icon: HardDrive, k: "On-device", v: "100%" },
];

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.24em]">
      {children}
    </motion.span>
  );
};

const PrivacyTrust = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = statement.split(" ");

  return (
    <section id="privacy" data-testid="privacy-section" className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <img src={TEXTURE} alt="" className="h-full w-full object-cover opacity-[0.13]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[#d91636]">
          // Private by design
        </div>

        <h2
          ref={ref}
          className="font-heading mt-6 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-white"
        >
          {words.map((w, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            >
              {w}
            </Word>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-zinc-400 leading-relaxed"
        >
          No telemetry. No silent API calls. No &quot;we&apos;ve updated our terms.&quot; Bring your
          own weights, run Lucy on your machine — she is yours, entirely.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              data-testid={`privacy-stat-${i}`}
              className="glass rounded-3xl p-6 hover:border-[#d91636]/30 transition-colors duration-500"
            >
              <s.icon className="h-5 w-5 text-[#d91636]" />
              <div className="font-heading mt-4 text-4xl font-black text-white">{s.v}</div>
              <div className="mt-1 font-mono-ui text-[9px] tracking-[0.25em] uppercase text-zinc-500">
                {s.k}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacyTrust;

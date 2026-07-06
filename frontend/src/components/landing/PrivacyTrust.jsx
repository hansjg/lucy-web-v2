import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, WifiOff, HardDrive } from "lucide-react";

const statement = "What happens on your device stays on your device.";

const stats = [
  { icon: ShieldCheck, k: "Cloud dependencies", v: "0" },
  { icon: WifiOff, k: "Outbound calls", v: "0" },
  { icon: HardDrive, k: "On-device", v: "100%" },
];

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
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
    <section id="privacy" data-testid="privacy-section" className="relative py-32 md:py-44">
      <div className="relative px-6 md:pl-[6vw] lg:pl-[8vw] md:max-w-[52%]">
        <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[color:var(--pulse)]">
          // Private by design
        </div>

        <h2
          ref={ref}
          className="font-heading mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-[color:var(--ink)]"
        >
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-[color:var(--ink-soft)] leading-relaxed"
        >
          No telemetry. No silent API calls. No &quot;we&apos;ve updated our terms.&quot; Bring your
          own weights, run Lucy on your machine — she is yours, entirely.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              data-testid={`privacy-stat-${i}`}
              className="glass rounded-3xl p-6"
            >
              <s.icon className="h-5 w-5 text-[color:var(--pulse)]" />
              <div className="font-heading mt-4 text-4xl font-black text-[color:var(--pulse)]">
                {s.v}
              </div>
              <div className="mt-1 font-mono-ui text-[9px] tracking-[0.25em] uppercase text-[color:var(--ink-faint)]">
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

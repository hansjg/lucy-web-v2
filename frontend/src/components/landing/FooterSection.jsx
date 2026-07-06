import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WaitlistForm from "./WaitlistForm";

const faqs = [
  {
    q: "What exactly is Lucy?",
    a: "Lucy is an AI companion that combines a real chatbot brain with a fully animated character. She talks (TTS), listens (STT), sees (image recognition), remembers context across sessions, and can run entirely on your own hardware.",
  },
  {
    q: "Do I need cloud access to use her?",
    a: "No. Lucy is local-first. You can plug in a local model (GGUF, ONNX, MLX) and run her offline. Optional cloud routing is supported but never required.",
  },
  {
    q: "What makes her different from other AI assistants?",
    a: "Most chatbots are a text box. Lucy is a living character with smooth emotional transitions and gesture animations — she points to the parts of the answer she values, leans in when curious, slows down when she explains.",
  },
  {
    q: "What hardware do I need to run Lucy locally?",
    a: "Minimum 6 GB VRAM for the standard model. CPU-only inference is supported for smaller variants. A discrete GPU (NVIDIA / Apple Silicon / AMD) is recommended for real-time voice + vision.",
  },
  {
    q: "When can I actually use Lucy?",
    a: "Lucy is currently in a preview build. Join the waitlist with your email and we'll send you access when the gate opens — early supporters get priority.",
  },
  {
    q: "Who is building this?",
    a: "Lucy is a Dexalab project (dexalab.org). The team is independent — no big-platform owner, no tracking, no data harvesting.",
  },
];

const ease = [0.22, 1, 0.36, 1];

const FooterSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <footer ref={ref} data-testid="footer-section" className="relative">
      <section id="join" className="py-24 md:py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="font-mono-ui text-[10px] tracking-[0.3em] uppercase text-[color:var(--pulse)]">
            // Last call
          </div>
          <h2 className="font-heading mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[color:var(--ink)]">
            Be <span className="text-iris-gradient">first in line</span>.
          </h2>
          <p className="mt-5 max-w-md mx-auto text-[color:var(--ink-soft)] leading-relaxed">
            No spam. One email — when the gate opens. Early supporters get priority access.
          </p>
          <div className="mt-9 max-w-md mx-auto">
            <WaitlistForm source="footer" />
          </div>
        </motion.div>
      </section>

      <section id="faq" data-testid="faq-section" className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[color:var(--ink)] text-center"
          >
            Questions, answered.
          </motion.h3>

          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i + 1}`}
                data-testid={`faq-accordion-item-${i + 1}`}
                className="glass rounded-2xl px-6 border-[color:var(--glass-border)]"
              >
                <AccordionTrigger className="text-left font-heading text-base font-semibold text-[color:var(--ink)] hover:no-underline hover:text-[color:var(--pulse)] py-5 [&>svg]:text-[color:var(--ink-faint)]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[color:var(--ink-soft)] leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <div className="overflow-hidden pt-16 pb-8">
        <motion.div
          style={{ x }}
          className="whitespace-nowrap text-center font-heading font-black tracking-tighter leading-none text-[14vw] select-none"
        >
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1px rgba(50,43,61,0.14)" }}
          >
            DEXALAB
          </span>
          <span className="opacity-30" style={{ color: "#6c4cf1" }}>.ORG</span>
        </motion.div>
      </div>

      <div className="border-t border-[color:var(--glass-border)] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-ui text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-faint)]">
          <span>© 2026 Dexalab · All rights reserved</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#46c589] lucy-blink" />
            Lucy · Preview build 0.9
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

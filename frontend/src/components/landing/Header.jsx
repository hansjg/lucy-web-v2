import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { scrollToId } from "./SmoothScroll";

const links = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Emotions", href: "#emotions" },
  { label: "Privacy", href: "#privacy" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <>
      <motion.div
        data-testid="scroll-progress-bar"
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[70] bg-gradient-to-r from-[#d91636] via-[#7a1024] to-[#b9a2c2]"
      />
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 inset-x-0 z-50 px-4"
        data-testid="site-header"
      >
        <div className="max-w-5xl mx-auto glass rounded-full flex items-center justify-between pl-6 pr-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => scrollToId("#hero")}
            data-testid="header-logo"
            className="flex items-baseline gap-2 group"
          >
            <span className="font-heading font-black text-lg tracking-tight text-white group-hover:text-[#f01e42] transition-colors">
              LUCY
            </span>
            <span className="font-mono-ui text-[9px] tracking-[0.3em] uppercase text-zinc-500">
              by Dexalab
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollToId(l.href)}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className="px-4 py-2 rounded-full text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollToId("#join")}
            data-testid="header-join-waitlist-button"
            className="rounded-full bg-[#d91636] text-white text-[13px] font-heading font-bold px-5 py-2.5 hover:bg-[#f01e42] hover:shadow-[0_0_22px_rgba(217,22,54,0.45)] hover:-translate-y-px transition-[box-shadow,transform,background-color] duration-300"
          >
            Join Waitlist
          </button>
        </div>
      </motion.header>
    </>
  );
};

export default Header;

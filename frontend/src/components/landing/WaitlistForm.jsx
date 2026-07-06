import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { joinWaitlist } from "@/lib/lucyApi";
import { toast } from "sonner";

const WaitlistForm = ({ source = "hero", className = "" }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const data = await joinWaitlist(email, source);
      setResult(data);
      toast.success(data.already_registered ? "You're already in" : "You're on the list", {
        description: data.message,
      });
      if (!data.already_registered) setEmail("");
    } catch (err) {
      toast.error("Something went wrong", {
        description: err?.response?.data?.detail?.[0]?.msg || "Check your email and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <form
        onSubmit={onSubmit}
        data-testid={`${source}-waitlist-form`}
        className="glass rounded-full p-1.5 flex items-center gap-2 max-w-md w-full mx-auto focus-within:border-[#d91636]/50 transition-colors"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          data-testid={`${source}-waitlist-email-input`}
          className="flex-1 min-w-0 bg-transparent outline-none border-0 pl-5 pr-2 py-2.5 text-sm text-white placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={submitting}
          data-testid={`${source}-waitlist-submit-button`}
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#d91636] text-white font-heading font-bold text-sm px-6 py-3 hover:bg-[#f01e42] hover:shadow-[0_0_26px_rgba(217,22,54,0.5)] transition-[box-shadow,background-color] duration-300 disabled:opacity-60"
        >
          {submitting ? "Joining…" : "Get Early Access"}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
      <AnimatePresence>
        {result && (
          <motion.p
            key={result.position}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            data-testid={`${source}-waitlist-result`}
            className="mt-4 text-center font-mono-ui text-[11px] tracking-[0.2em] uppercase text-[#ff5c74]"
          >
            {result.already_registered
              ? `Already on the list — position #${result.position}`
              : `You're #${result.position} in line`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaitlistForm;

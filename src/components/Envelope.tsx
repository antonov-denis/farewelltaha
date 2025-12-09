// src/components/Envelope.tsx
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

type EnvelopeProps = {
  onOpened?: () => void;
};

const Envelope: React.FC<EnvelopeProps> = ({ onOpened }) => {
  const [isOpen, setIsOpen] = useState(false);

  // When envelope opens, trigger callback after the opening animation
  useEffect(() => {
    if (!isOpen || !onOpened) return;

    const timeout = setTimeout(() => {
      onOpened();
    }, 900); // roughly matches the opening motion

    return () => clearTimeout(timeout);
  }, [isOpen, onOpened]);

  return (
    <motion.div
      className="relative cursor-pointer select-none w-[440px] sm:w-[520px] h-[260px] sm:h-[320px] flex items-center justify-center"
      onClick={() => {
        if (!isOpen) setIsOpen(true);
      }}
      whileHover={!isOpen ? { y: -6 } : undefined}
      animate={isOpen ? { scale: 1.03 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
    >
      {/* Soft shadow under envelope */}
      <div className="pointer-events-none absolute inset-x-10 -bottom-10 h-10 rounded-full bg-black/10 blur-xl" />

      {/* Wrapper so we can put flap *outside* the overflow-hidden pocket */}
      <div className="relative w-full h-full">
        {/* Envelope pocket (clips inside content, but NOT the flap) */}
        <div className="relative w-full h-full rounded-3xl bg-[#fef3e5] border border-[#f1c19b] shadow-xl overflow-hidden">
          {/* Inner subtle gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-[#f3c29f]/50" />

          {/* Side flaps (visual detail only) */}
          <div className="absolute inset-0">
            {/* Left side */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full bg-[#f9d5b9] border-t border-r border-[#f1c19b]"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
            {/* Right side */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full bg-[#f9d5b9] border-t border-l border-[#f1c19b]"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
            />
          </div>
        </div>

        {/* Top flap - sibling of pocket, so not clipped by overflow-hidden */}
        <motion.div
          className={`absolute left-0 top-0 w-full h-3/4 bg-[#f8cba9] border-t border-[#f1c19b] origin-top shadow-2xl z-10 ${
            !isOpen ? "rounded-t-3xl" : ""
          }`}
          style={{
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            transformStyle: "preserve-3d",
          }}
          initial={false}
          animate={
            isOpen
              ? { rotateX: -160, transformPerspective: 900, y: 18 }
              : { rotateX: 0, transformPerspective: 900 }
          }
          whileHover={
            !isOpen
              ? {
                  scaleY: 0.9,
                  transformPerspective: 900,
                }
              : undefined
          }
          transition={{ type: "spring", stiffness: 230, damping: 18 }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#e2a77b]/50 ${
              !isOpen ? "rounded-t-3xl" : ""
            }`}
          />
          <div className="absolute inset-x-4 bottom-0 h-6 bg-black/10 blur-md opacity-40 pointer-events-none" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Envelope;

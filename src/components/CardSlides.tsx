// src/components/CardSlides.tsx
import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Card from "./Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Wish = {
  message: string;
  author: string;
};

const wishes: Wish[] = [
  {
    message:
      "Taha, thank you for helping me from the very beginning - for everything you showed me, everything you taught me, and every piece of advice along the way. Your patience and kindness meant more than you know. I truly hope our paths cross again someday. Thank you, friend.",
    author: "Denis",
  },
  {
    message: "Hey Taha, it was such a pleasure working with you! Your subtle positive energy, your hard work and diligence will be greatly missed! I'm sure another interesting project is ahead of you. I wish you a lot of success and hopefully our paths will cross again 🙂 Thank you for everything, but mostly for putting up with my crazy questions and unpolished requirements!!!",
    author: "Teddy",
  },
  {
    message: "It’s been great working with you. Thank you.",
    author: "Ventsi",
  },
  {
    message: "Thank you for all the mysterious investigations, years of great work and being such an awesome teamplayer!",
    author: "Milenka",
  },
  {
    message: "I'm Spas",
    author: "Spas",
  },
];

const flipVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    rotateY: direction > 0 ? 90 : -90,
    x: direction > 0 ? 40 : -40,
    transition: { duration: 0.35 }, // removed ease
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    transition: { duration: 0.4 }, // removed ease
  },
  exit: (direction: number) => ({
    opacity: 0,
    rotateY: direction > 0 ? -90 : 90,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.35 }, // removed ease
  }),
};

const CardSlides: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = wishes.length;

  const goTo = useCallback(
    (nextIndex: number, dir: number) => {
      if (nextIndex < 0) {
        nextIndex = total - 1;
      } else if (nextIndex >= total) {
        nextIndex = 0;
      }
      setDirection(dir);
      setIndex(nextIndex);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [index, goTo]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [index, goTo]);

  // keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const currentWish = wishes[index];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#fcd0b1] px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#b85b2f] mb-1">
          From all of us
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#4a2d22]">
          Farewell, Taha!
        </h1>
      </div>

      {/* Slider container */}
      <div className="relative w-full max-w-3xl flex items-center justify-center">
        {/* Left arrow (desktop only) */}
        <button
          onClick={goPrev}
          className="cursor-pointer hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-[#f1b189] bg-white/80 shadow-md hover:bg-white transition text-[#b85b2f] mr-3"
          aria-label="Previous message"
        >
          <ChevronLeft />
        </button>

        {/* Slide area */}
        <div
          className="relative flex-1 min-h-[220px] sm:min-h-[260px] flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={flipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card message={currentWish.message} author={currentWish.author} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right arrow (desktop only) */}
        <button
          onClick={goNext}
          className="cursor-pointer hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-[#f1b189] bg-white/80 shadow-md hover:bg-white transition text-[#b85b2f] ml-3"
          aria-label="Next message"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Bottom navigation - MOBILE ONLY */}
      <div className="mt-6 w-full max-w-md sm:hidden flex items-center justify-between">
        <button
          onClick={goPrev}
          className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-full border border-[#f1b189] bg-white/90 shadow-md text-[#b85b2f] text-sm active:scale-95 transition"
          aria-label="Previous message"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </button>

        <div className="text-sm font-medium text-[#4a2d22]">
          {index + 1} / {total}
        </div>

        <button
          onClick={goNext}
          className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-full border border-[#f1b189] bg-white/90 shadow-md text-[#b85b2f] text-sm active:scale-95 transition"
          aria-label="Next message"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Tracker + hint - DESKTOP ONLY */}
      <div className="mt-6 hidden sm:flex flex-col items-center gap-1">
        <div className="text-sm font-medium text-[#4a2d22]">
          {index + 1} / {total}
        </div>
        <div className="text-[0.7rem] text-[#7c523d]/80">
          Use ← → arrow keys to navigate
        </div>
      </div>
    </div>
  );
};

export default CardSlides;

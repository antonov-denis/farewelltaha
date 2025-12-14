/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import Card from "./Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { loadItems } from "../lib/supabase";

type Wish = {
  message: string;
  author: string;
};

const flipVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    rotateY: direction > 0 ? 90 : -90,
    x: direction > 0 ? 40 : -40,
    transition: { duration: 0.35 },
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    transition: { duration: 0.4 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    rotateY: direction > 0 ? -90 : 90,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.35 },
  }),
};

const CardSlides: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const rows = await loadItems();
        const mapped: Wish[] = (rows ?? [])
          .filter((r: any) => r?.value && r?.author)
          .map((r: any) => ({ message: r.value, author: r.author }));

        if (!cancelled) {
          setWishes(mapped);
          setIndex(0);
        }
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message ?? "Failed to load wishes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const total = wishes.length;

  useEffect(() => {
    if (total === 0) return;
    if (index >= total) setIndex(0);
  }, [total, index]);

  const goTo = useCallback(
    (nextIndex: number, dir: number) => {
      if (total === 0) return;

      if (nextIndex < 0) nextIndex = total - 1;
      else if (nextIndex >= total) nextIndex = 0;

      setDirection(dir);
      setIndex(nextIndex);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [index, goTo]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [index, goTo]);

  useEffect(() => {
    if (total === 0) return;

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
  }, [goNext, goPrev, total]);

  const currentWish = useMemo(() => wishes[index], [wishes, index]);

  if (loading || loadError || total === 0) return null;

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
          className="relative flex-1 min-h-80 flex items-center justify-center"
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

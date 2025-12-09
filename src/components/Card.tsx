import { type FC } from "react";

type CardProps = {
  message: string;
  author: string;
};

const Card: FC<CardProps> = ({ message, author }) => {
  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/90 border border-[#f7d8c0] shadow-xl px-8 py-6 sm:px-10 sm:py-8 flex flex-col gap-4">
      <p className="text-base sm:text-lg leading-relaxed text-[#4a2d22] text-center">
        {message}
      </p>

      <div className="mt-2 text-right text-sm sm:text-base font-semibold text-[#c46938]">
        — {author}
      </div>
    </div>
  );
};

export default Card;

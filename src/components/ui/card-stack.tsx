'use client';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Card = {
  id: number;
  content: React.ReactNode;
};

export const CardStack = ({
  cards,
  offset,
  scaleFactor,
}: {
  cards: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={cn(
              "absolute dark:bg-black bg-white rounded-3xl p-7 shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between",
              cards.length === 1 && "left-1/2 -translate-x-1/2"
            )}
            style={{ transformOrigin: "top center" }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

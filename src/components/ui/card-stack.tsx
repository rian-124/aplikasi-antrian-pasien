import React from "react";

export type Card = {
  id: number;
  content: React.ReactNode;
};

export const CardStack = ({ cards }: { cards: Card[] }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-3xl p-7 shadow-xl border border-neutral-200 flex flex-col justify-between w-full max-w-md mx-auto"
        >
          <div className="font-normal text-neutral-700">
            {card.content}
          </div>
        </div>
      ))}
    </div>
  );
};

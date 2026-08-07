import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcard) return null;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const starButtonClass = (isFront = true) =>
    `w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
      flashcard.isStarred
        ? isFront
          ? "bg-yellow-400 text-white shadow-lg"
          : "bg-white/30 text-white border border-white/40 shadow-lg"
        : isFront
          ? "bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-yellow-500"
          : "bg-white/20 text-white/70 hover:bg-white/30"
    }`;

  const handleStarClick = (e) => {
    e.stopPropagation();
    if (onToggleStar && flashcard._id) onToggleStar(flashcard._id);
  };

  return (
    <div
      className="relative w-full max-w-xl h-[320px] md:h-[360px] lg:h-[400px]"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-6 shadow-lg bg-white border flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-between">
            <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded">
              Question
            </span>

            <button className={starButtonClass(true)} onClick={handleStarClick}>
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-center text-lg font-semibold">
              {flashcard.question}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <RotateCcw className="w-4 h-4" />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-6 shadow-lg bg-gray-900 text-white flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex justify-between">
            <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded">
              Answer
            </span>

            <button
              className={starButtonClass(false)}
              onClick={handleStarClick}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-center text-lg">{flashcard.answer}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-white/60">
            <RotateCcw className="w-4 h-4" />
            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

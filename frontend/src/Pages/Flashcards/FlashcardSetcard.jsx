import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed,
  ).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      onClick={handleStudyNow}
      className="cursor-pointer group transition-all duration-300"
    >
      <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-emerald-100 text-emerald-500 p-3 rounded-xl">
            <BookOpen className="w-5 h-5" strokeWidth={2} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg truncate">
              {flashcardSet?.documentId?.title}
            </h3>
            <p className="text-sm text-gray-500">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            {totalCards} {totalCards === 1 ? "Card" : "Cards"}
          </span>

          {reviewedCount > 0 && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
              {progressPercentage}%
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCards > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {reviewedCount}/{totalCards} reviewed
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Study Button */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStudyNow();
            }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-400 transition-all duration-300 relative overflow-hidden"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Study Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardSetCard;

import moment from "moment";
import { Trash2, Award, BarChart2, Play } from "lucide-react";
import { Link } from "react-router-dom";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group hover:border-2 hover:border-emerald-300 transition-duration-300 ease-in-out">
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      {/* Score Badge */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
          <Award className="w-4 h-4" strokeWidth={2.5} />
          <span>Score: {quiz?.score ?? 0}</span>
        </div>
      </div>

      {/* Quiz Title */}
      <div className="mb-3">
        <h3
          className="text-lg font-semibold text-gray-800 line-clamp-1"
          title={quiz.title}
        >
          {quiz.title ||
            `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
        </h3>

        <p className="text-sm text-gray-500">
          Created {moment(quiz.createdAt).format("MMM D, YYYY")}
        </p>
      </div>

      {/* Quiz Info */}
      <div className="mb-5">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
          {quiz.questions.length}{" "}
          {quiz.questions.length === 1 ? "Question" : "Questions"}
        </span>
      </div>

      {/* Action Button */}
      <div>
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 rounded-lg font-medium transition">
              <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 rounded-lg font-medium transition">
              <Play className="w-4 h-4" strokeWidth={2.5} />
              Start Quiz
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;

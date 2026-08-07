import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Header from "../../components/layout/Header";
const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- FETCH QUIZ ---------------- */

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error("Failed to fetch quiz.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  /* ---------------- OPTION SELECT ---------------- */

  const handleOptionChange = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  /* ---------------- NAVIGATION ---------------- */

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /* ---------------- SUBMIT QUIZ ---------------- */

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);

      const answers = Object.entries(selectedAnswers).map(
        ([questionIndex, selectedAnswer]) => ({
          questionIndex: Number(questionIndex),
          selectedAnswer,
        }),
      );

      console.log("Submitting answers:", answers);

      // FIXED HERE
      await quizService.submitQuiz(quizId, answers);

      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading || !quiz) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  /* ---------------- EMPTY QUIZ ---------------- */

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Quiz not found or has no questions.
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  /* ---------------- UI ---------------- */

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <PageHeader
          title={quiz.title}
          subtitle={`Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}
        />

        {/* Progress Bar */}

        <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(answeredCount / quiz.questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Question Card */}

        <div className="mt-8 bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected =
                selectedAnswers[currentQuestionIndex] === index;

              return (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50"
                }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    checked={isSelected}
                    onChange={() =>
                      handleOptionChange(currentQuestionIndex, index)
                    }
                    className="accent-emerald-500"
                  />

                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}

        <div className="flex items-center justify-between mt-10">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
            variant="secondary"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            Previous
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl 
            bg-emerald-600 text-white font-medium shadow-md
            hover:bg-emerald-700 hover:shadow-lg
            transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                  Submit Quiz
                </>
              )}
            </button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          )}
        </div>

        {/* Answer Counter */}

        <div className="text-center mt-6 text-sm text-gray-500">
          {answeredCount} / {quiz.questions.length} questions answered
        </div>
      </div>
    </>
  );
};

export default QuizTakePage;

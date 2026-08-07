import Quiz from "../models/Quiz.js";

// @desc    Get all quizzes for a document
// @route   GET /api/quizzes/:documentId
// @access  Private
// @desc    Get all quizzes for a document
// @route   GET /api/quizzes/:documentId
// @access  Private
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single quiz by ID
// @route   GET /api/quizzes/quiz/:id
// @access  Private

export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: "Please provide answers array",
      });
    }

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: "Quiz already completed",
      });
    }

    let correctCount = 0;
    const userAnswers = [];

    for (const answer of answers) {
      const { questionIndex, selectedAnswer } = answer;

      if (
        questionIndex < 0 ||
        questionIndex >= quiz.questions.length
      ) {
        continue;
      }

      const question = quiz.questions[questionIndex];

      // If frontend sends option index
      const selectedOption =
        typeof selectedAnswer === "number"
          ? question.options[selectedAnswer]
          : question.options[Number(selectedAnswer)];

      // Remove prefixes like "01: " if present
      const correctOption = question.correctAnswer
        .replace(/^\d+:\s*/, "")
        .trim();

      const isCorrect =
        (selectedOption || "").trim() === correctOption;

      if (isCorrect) {
        correctCount++;
      }

      userAnswers.push({
        questionIndex,
        selectedAnswer: selectedOption,
        isCorrect,
        answeredAt: new Date(),
      });
    }

    const totalQuestions = quiz.questions.length;

    const percentage = Math.round(
      (correctCount / totalQuestions) * 100
    );

    quiz.userAnswers = userAnswers;
    quiz.score = percentage; // Store percentage
    quiz.totalQuestions = totalQuestions;
    quiz.completedAt = new Date();

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        quizId: quiz._id,
        score: percentage,
        correctCount,
        totalQuestions,
        percentage,
        userAnswers,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("documentId", "title");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
        statusCode: 404,
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        error: "Quiz not completed yet",
        statusCode: 400,
      });
    }

    // Build detailed results
    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        (a) => a.questionIndex === index,
      );

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt,
        },
        results: detailedResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found",
        statusCode: 404,
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

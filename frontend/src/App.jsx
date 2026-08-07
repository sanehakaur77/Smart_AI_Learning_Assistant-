
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardPage from "./Pages/Dashboard/DashboardPage";
import DocumentListPage from "./Pages/Documents/DocumentListPage";
import DocumentDetailPage from "./Pages/Documents/DocumentDetailPage";
import FlashcardPage from "./Pages/Flashcards/FlashcardPage";
import FlashcardsListPage from "./Pages/Flashcards/FlashcardsListPage";
import QuizTakePage from "./Pages/Quizzes/QuizTakePage";
import QuizResultPage from "./Pages/Quizzes/QuizResultPage";
import ProfilePage from "./Pages/Profile/ProfilePage";

import LoginPage from "./Pages/Auth/LoginPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import NotFoundPage from "./Pages/Quizzes/NotFoundPage";
import { useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Now ALL routes are public */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

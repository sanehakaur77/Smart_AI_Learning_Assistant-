import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Layers,
  HelpCircle,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Menu,
  BrainCircuit,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../../utils/apiPaths";
import Sidebar from "../../components/layout/Sidebar";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}${API_PATHS.PROGRESS.GET_DASHBOARD}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data?.success) {
          setDashboardData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400"></div>
        </div>
      );
    }

    if (error || !dashboardData) {
      return (
        <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
          {error || "No data available."}
        </div>
      );
    }

    const { overview, recentActivity } = dashboardData;

    const flashcardProgress =
      overview.totalFlashcards > 0
        ? Math.round(
            (overview.reviewedFlashcards / overview.totalFlashcards) * 100
          )
        : 0;

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold  dark:text-white text-emerald-500">
              Learning Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Track your study progress, flashcards, and quiz metrics.
            </p>
          </div>
        </div>

        {/* Overview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Documents */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Documents
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overview.totalDocuments}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-gray-700/50 text-emerald-400 rounded-lg border border-gray-100 dark:border-gray-700">
              <FileText size={22} />
            </div>
          </div>

          {/* Total Flashcards */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Flashcards
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overview.totalFlashcards}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                Across {overview.totalFlashcardSets} set(s)
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-gray-700/50 text-emerald-400 rounded-lg border border-gray-100 dark:border-gray-700">
              <Layers size={22} />
            </div>
          </div>

          {/* Quizzes Completed */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Quizzes Done
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overview.completedQuizzes} / {overview.totalQuizzes}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-gray-700/50 text-emerald-400 rounded-lg border border-gray-100 dark:border-gray-700">
              <CheckCircle2 size={22} />
            </div>
          </div>

          {/* Average Score */}
          <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                Avg. Quiz Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {overview.averageScore}%
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-gray-700/50 text-emerald-400 rounded-lg border border-gray-100 dark:border-gray-700">
              <Award size={22} />
            </div>
          </div>
        </div>

        {/* Middle Banner & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flashcard Mastery Status */}
          <div className="lg:col-span-1 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-400" />
                Flashcard Progress
              </h2>
              <span className="text-xs font-bold text-emerald-400">
                {flashcardProgress}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${flashcardProgress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-700/40 rounded-lg border border-gray-100 dark:border-gray-700/40">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-400">Reviewed</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {overview.reviewedFlashcards} cards
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-700/40 rounded-lg border border-gray-100 dark:border-gray-700/40">
                <Star size={18} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-400">Starred</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {overview.starredFlashcards} cards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Callout */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl border border-emerald-400/30 dark:border-emerald-400/20 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <span className="px-2.5 py-1 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 rounded-full text-xs font-medium">
                Continue to learn something new....
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-3">
                Ready to learn something new?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xl">
                Upload a document or revisit your flashcards to build your active learning habits today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/documents"
                className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-sm shadow-emerald-400/20"
              >
                Upload Document
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-emerald-400" />
                Recent Documents
              </h2>
              <Link
                to="/documents"
                className="text-xs font-medium text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {recentActivity.documents.length > 0 ? (
                recentActivity.documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-700/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={18} className="text-gray-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {doc.title || doc.fileName}
                        </p>
                        <p className="text-xs text-gray-400">
                          Accessed {new Date(doc.lastAccessed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 rounded-full font-medium capitalize">
                      {doc.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No recent documents
                </p>
              )}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-400" />
                Recent Quizzes
              </h2>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {recentActivity.quizzes.length > 0 ? (
                recentActivity.quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-700/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <HelpCircle size={18} className="text-gray-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {quiz.documentId?.title ? `Doc: ${quiz.documentId.title}` : "Quiz"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-emerald-400">
                        {quiz.score}%
                      </span>
                      <p className="text-xs text-gray-400">
                        {quiz.totalQuestions} Questions
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No quiz history available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Integrated Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Layout Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-400">
              <BrainCircuit className="text-white" size={18} />
            </div>
            <span className="font-bold text-sm text-gray-900 dark:text-white">
              AI Learning Assistant
            </span>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Dashboard Content Container */}
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
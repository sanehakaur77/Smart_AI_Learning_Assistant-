import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Menu } from "lucide-react";

import Modal from "../../components/common/Modal";
import Flashcard from "../Flashcards/Flashcard";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import Sidebar from "../../components/layout/Sidebar";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  // State Declarations
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Fetch Flashcards for Current Document
  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      const setObj = response.data?.[0] || null;

      setFlashcardSet(setObj);
      setFlashcards(setObj?.cards || []);
      setCurrentCardIndex(0); // Reset index on fresh fetch
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    if (documentId) {
      fetchFlashcards();
    }
  }, [documentId, fetchFlashcards]);

  // AI Generation Handler
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // Navigation Handlers
  const handleNextCard = () => {
    if (!flashcards.length) return;
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    if (!flashcards.length) return;
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  // Card Review Handler
  const handleReview = async (ratingOrIndex) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, ratingOrIndex);
    } catch (error) {
      console.error("Failed to review flashcard:", error);
    }
  };

  // Star Toggle Handler
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  // Delete Set Handler
  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSet?._id) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSet._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <main className="w-full md:pl-64 flex-1 transition-all duration-200 ease-in-out">
        {/* Mobile Top Header / Navigation Trigger */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">Flashcards</span>
          <div className="w-6" /> {/* Placeholder balance spacer */}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Link */}
          <Link
            to={`/documents/${documentId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft size={18} />
            Back to Document
          </Link>

          {/* Main Content Card Container */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-8 border-b border-gray-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Flashcards
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Review and memorize concepts from your document.
                </p>
              </div>

              {!loading &&
                (flashcards.length > 0 ? (
                  <Button
                    variant="danger"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full sm:w-auto justify-center"
                  >
                    Delete Set
                  </Button>
                ) : (
                  <Button
                    onClick={handleGenerateFlashcards}
                    disabled={generating}
                    className="w-full sm:w-auto justify-center"
                  >
                    {generating ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <Plus size={17} />
                        Generate Flashcards
                      </>
                    )}
                  </Button>
                ))}
            </div>

            {/* Body Section */}
            <div className="p-4 sm:p-8">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner />
                </div>
              ) : flashcards.length === 0 ? (
                <div className="py-8">
                  <EmptyState
                    title="No Flashcards Yet"
                    description="Generate AI flashcards from your document to start learning."
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Interactive Flashcard Container */}
                  <div className="w-full max-w-2xl">
                    <Flashcard
                      flashcard={flashcards[currentCardIndex]}
                      onToggleStar={handleToggleStar}
                    />
                  </div>

                  {/* Navigation & Counter Controls */}
                  <div className="mt-8 sm:mt-10 w-full max-w-md flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                    <Button
                      variant="secondary"
                      onClick={handlePrevCard}
                      disabled={flashcards.length <= 1}
                      className="flex-1 sm:flex-none justify-center min-w-[110px]"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </Button>

                    <div className="order-first sm:order-none w-full sm:w-auto text-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-semibold text-sm">
                      {currentCardIndex + 1} of {flashcards.length}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={handleNextCard}
                      disabled={flashcards.length <= 1}
                      className="flex-1 sm:flex-none justify-center min-w-[110px]"
                    >
                      Next
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Flashcard Set"
        >
          <div className="space-y-5">
            <p className="text-gray-600 text-sm sm:text-base">
              Are you sure you want to delete all flashcards? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:w-auto justify-center"
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={handleDeleteFlashcardSet}
                disabled={deleting}
                className="w-full sm:w-auto justify-center"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default FlashcardPage;
import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Flashcard from "./Flashcard";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Sparkles,
  Brain,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import moment from "moment";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch flashcard sets
  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  // Generate new flashcards
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  // Select a flashcard set
  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0); // Reset card index
  };

  // Delete flow
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to delete set");
    } finally {
      setDeleting(false);
    }
  };

  // Toggle star status
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId
              ? { ...card, isStarred: !card.isStarred }
              : card,
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  // Card navigation
  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) =>
      Math.min(prev + 1, selectedSet.cards.length - 1),
    );
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/* Flashcard Display */}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
              className="shadow-xl rounded-2xl border border-gray-200 bg-white p-6 transform transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={handlePrevCard}
            disabled={selectedSet.cards.length <= 1}
            className="group flex items-center gap-2 px-5 h-11 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            Previous
          </button>

          <div className="text-sm font-medium text-slate-500">
            {currentCardIndex + 1} / {selectedSet.cards.length}
          </div>

          <button
            onClick={handleNextCard}
            disabled={selectedSet.cards.length <= 1}
            className="group flex items-center gap-2 px-5 h-11 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  };
  // Flashcard sets list UI
  const renderSetList = () => {
    if (loading) return <Spinner />;

    if (flashcardSets.length === 0) {
      return (
        <div className="text-center py-20">
          <Brain className="w-14 h-14 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Flashcards Yet</h3>
          <p className="text-gray-500 mb-6">
            Generate flashcards from your document.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg flex items-center gap-2 mx-auto hover:bg-emerald-400"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">Your Flashcard Sets</h3>
            <p className="text-gray-500">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"}
            </p>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-400"
          >
            <Plus className="w-4 h-4" />
            {generating ? "Generating..." : "Generate New Set"}
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-white border-2 border-emerald-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer max-w-md"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-emerald-600" size={22} />
              </div>

              {/* Title */}
              <h4 className="text-lg font-semibold text-gray-800">
                Flashcard Set
              </h4>

              {/* Date */}
              <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">
                CREATED {moment(set.createdAt).format("MMM D, YYYY")}
              </p>

              <div className="border-t my-4"></div>

              {/* Cards Count */}
              <span className="inline-block px-4 py-1 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700">
                {set.cards.length} cards
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flashcard-manager p-6">
      {selectedSet ? renderFlashcardViewer() : renderSetList()}

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p>
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardManager;

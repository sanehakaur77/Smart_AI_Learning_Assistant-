import React, { useState } from "react";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../../components/common/MarkDownRenderer";

const AIActions = ({ documentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");

    try {
      const { summary } = await aiService.generateSummary(documentId);

      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");

    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept,
      );

      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Sparkles className="text-green-600 w-6 h-6" strokeWidth={2} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              AI Assistant
            </h3>
            <p className="text-sm text-gray-500">Powered by advanced AI</p>
          </div>
        </div>

        {/* Generate Summary */}
        <div className="bg-gray-50 rounded-xl p-5 border hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="text-blue-600 w-5 h-5" strokeWidth={2} />
                </div>

                <h4 className="font-semibold text-gray-800">
                  Generate Summary
                </h4>
              </div>

              <p className="text-sm text-gray-500">
                Get a concise summary of the entire document.
              </p>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={loadingAction === "summary"}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-60"
            >
              {loadingAction === "summary" ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading
                </span>
              ) : (
                "Summarize"
              )}
            </button>
          </div>
        </div>

        {/* Explain Concept */}
        <div className="bg-gray-50 rounded-xl p-5 border hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Lightbulb className="text-yellow-600 w-5 h-5" strokeWidth={2} />
            </div>

            <h4 className="font-semibold text-gray-800">Explain Concept</h4>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Ask AI to explain any concept from this document.
          </p>

          <form onSubmit={handleExplainConcept} className="flex gap-2">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Enter concept..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loadingAction === "explain"}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-60"
            >
              {loadingAction === "explain" ? "Loading..." : "Explain"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{modalTitle}</h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="prose max-w-none">
              <MarkdownRenderer content={modalContent} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIActions;

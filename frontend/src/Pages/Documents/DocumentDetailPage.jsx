import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../ai/AiActions";
import FlashcardManager from "../Flashcards/FlashCardManager";
import QuizManager from "../Quizzes/QuizManager";
import Header from "../../components/layout/Header";
import { BASE_URL } from "../../utils/apiPaths";
const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl = BASE_URL;
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    if (!document?.data?.filePath) {
      return (
        <div className="text-center py-20 text-gray-500 text-lg">
          PDF not available
        </div>
      );
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <span className="font-semibold text-gray-700 text-lg">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        {/* PDF Viewer */}
        <div className="w-full h-[75vh] rounded-lg overflow-hidden border">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="PDF Viewer"
            frameBorder="0"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <ChatInterface documentId={id} />
      </div>
    );
  };

  const renderAIActions = () => {
    return <AIActions documentId={id} />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) return <Spinner />;

  if (!document) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Document not found
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
        </div>

        {/* Page Header */}
        <PageHeader title={document.data.title} />

        {/* Tabs */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </>
  );
};

export default DocumentDetailPage;
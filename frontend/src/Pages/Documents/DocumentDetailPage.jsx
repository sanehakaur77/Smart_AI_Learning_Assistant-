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

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Content");

  // ==========================================
  // FETCH DOCUMENT
  // ==========================================

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);

        const data = await documentService.getDocumentById(id);

        console.log("Document response:", data);

        setDocument(data);
      } catch (error) {
        console.error("Failed to fetch document:", error);

        toast.error("Failed to fetch document details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocumentDetails();
    }
  }, [id]);

  // ==========================================
  // LOAD PDF FROM CLOUDINARY
  // ==========================================

  useEffect(() => {
    const cloudinaryUrl = document?.data?.filePath;

    if (!cloudinaryUrl) {
      setPdfUrl(null);
      setPdfLoading(false);
      return;
    }

    console.log("Cloudinary PDF URL:", cloudinaryUrl);

    // Directly use Cloudinary URL.
    // No Axios, Blob or createObjectURL required.
    setPdfUrl(cloudinaryUrl);
    setPdfLoading(false);
  }, [document]);

  // ==========================================
  // CONTENT TAB
  // ==========================================

  const renderContent = () => {
  if (pdfLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-500">
              Loading PDF...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        PDF not available
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Document Viewer
          </h2>

          <p className="text-sm text-gray-500 mt-1 break-words">
            {document?.data?.fileName}
          </p>
        </div>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-lg
            text-teal-600
            border
            border-teal-200
            hover:bg-teal-50
            text-sm
            font-medium
            w-full
            sm:w-auto
          "
        >
          <ExternalLink size={17} />
          Open PDF
        </a>

      </div>

      {/* PDF */}
      <div className="w-full bg-gray-100">

        <iframe
          src={pdfUrl}
          title={document?.data?.fileName || "PDF Viewer"}
          className="
            block
            w-full
            h-[60vh]
            min-h-[450px]
            sm:h-[65vh]
            md:h-[70vh]
            lg:h-[75vh]
            border-0
          "
        />

      </div>

    </div>
  );
};

  // ==========================================
  // CHAT
  // ==========================================

  const renderChat = () => {
    return (
      <ChatInterface
        documentId={id}
      />
    );
  };

  // ==========================================
  // AI ACTIONS
  // ==========================================

  const renderAIActions = () => {
    return (
      <AIActions
        documentId={id}
      />
    );
  };

  // ==========================================
  // FLASHCARDS
  // ==========================================

  const renderFlashcardsTab = () => {
    return (
      <FlashcardManager
        documentId={id}
      />
    );
  };

  // ==========================================
  // QUIZZES
  // ==========================================

  const renderQuizzesTab = () => {
    return (
      <QuizManager
        documentId={id}
      />
    );
  };

  // ==========================================
  // TABS
  // ==========================================

  const tabs = [
    {
      name: "Content",
      label: "Content",
      content: renderContent(),
    },
    {
      name: "Chat",
      label: "Chat",
      content: renderChat(),
    },
    {
      name: "AI Actions",
      label: "AI Actions",
      content: renderAIActions(),
    },
    {
      name: "Flashcards",
      label: "Flashcards",
      content: renderFlashcardsTab(),
    },
    {
      name: "Quizzes",
      label: "Quizzes",
      content: renderQuizzesTab(),
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner />
      </div>
    );
  }

  // ==========================================
  // DOCUMENT NOT FOUND
  // ==========================================

  if (!document || !document.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">

        <h2 className="text-xl font-semibold text-gray-700">
          Document not found
        </h2>

        <Link
          to="/documents"
          className="mt-4 flex items-center gap-2 text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Documents
        </Link>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="container mx-auto px-4 py-6">

      {/* Back Button */}
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-5"
      >
        <ArrowLeft size={18} />
        Back to Documents
      </Link>

      {/* Page Header */}
      <PageHeader
        title={document.data.title}
      />

      {/* Tabs */}
      <div className="mt-6">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

    </div>
  );
};

export default DocumentDetailPage;
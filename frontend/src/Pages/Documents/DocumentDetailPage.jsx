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
import axios from "axios";

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

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
    let objectUrl = null;

    const loadPDF = async () => {
      const cloudinaryUrl = document?.data?.filePath;

      if (!cloudinaryUrl) {
        return;
      }

      try {
        setPdfLoading(true);

        console.log("Cloudinary PDF URL:", cloudinaryUrl);

        // Fetch PDF as binary data
        const response = await axios.get(cloudinaryUrl, {
          responseType: "blob",
        });

        console.log("PDF response:", response);
        console.log("Original content type:", response.data.type);

        // Force browser to treat it as PDF
        const pdfBlob = new Blob([response.data], {
          type: "application/pdf",
        });

        // Create temporary browser URL
        objectUrl = URL.createObjectURL(pdfBlob);

        console.log("PDF Blob URL:", objectUrl);

        setPdfUrl(objectUrl);
      } catch (error) {
        console.error("Failed to load PDF:", error);

        toast.error("Unable to load PDF.");
      } finally {
        setPdfLoading(false);
      }
    };

    loadPDF();

    // Cleanup old Blob URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [document]);

  // ==========================================
  // CONTENT TAB
  // ==========================================

  const renderContent = () => {
    if (pdfLoading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10">
          <div className="flex flex-col items-center justify-center">
            <Spinner />

            <p className="mt-4 text-gray-500">
              Loading PDF...
            </p>
          </div>
        </div>
      );
    }

    if (!document?.data?.filePath) {
      return (
        <div className="text-center py-20 text-gray-500 text-lg">
          PDF not available
        </div>
      );
    }

    if (!pdfUrl) {
      return (
        <div className="text-center py-20 text-gray-500 text-lg">
          Unable to load PDF
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-4">

          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              Document Viewer
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {document.data.fileName}
            </p>
          </div>

          {/* Open PDF */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ExternalLink size={17} />

            Open in new tab
          </a>

        </div>

        {/* PDF Viewer */}
        <div className="w-full h-[75vh] rounded-lg overflow-hidden border border-gray-300 bg-gray-100">

          <iframe
            src={pdfUrl}
            title={document.data.title || "PDF Viewer"}
            className="w-full h-full"
            frameBorder="0"
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
      <div className="flex flex-col justify-center items-center min-h-[70vh]">

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
    <div className="p-6">

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
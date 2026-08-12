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

  // =========================================================
  // FETCH DOCUMENT
  // =========================================================

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

  // =========================================================
  // GET PDF URL
  // =========================================================

  useEffect(() => {
    if (!document) {
      return;
    }

    const url =
      document?.data?.filePath ||
      document?.data?.fileUrl ||
      document?.data?.cloudinaryUrl ||
      document?.filePath ||
      document?.fileUrl ||
      document?.cloudinaryUrl ||
      null;

    console.log("================================");
    console.log("PDF URL:", url);
    console.log("================================");

    setPdfUrl(url);
    setPdfLoading(false);
  }, [document]);

  // =========================================================
  // CONTENT
  // =========================================================

  const renderContent = () => {
    // Loading
    if (pdfLoading) {
      return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Spinner />

              <p className="mt-4 text-gray-500 text-sm">
                Loading PDF...
              </p>
            </div>
          </div>
        </div>
      );
    }

    // No PDF
    if (!pdfUrl) {
      return (
        <div className="w-full bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">

            <h2 className="text-lg font-semibold text-gray-700">
              PDF not available
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              No PDF URL was found for this document.
            </p>

          </div>
        </div>
      );
    }

    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            p-4
            border-b
            border-gray-200
          "
        >

          {/* Title */}

          <div className="min-w-0 flex-1">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Document Viewer
            </h2>

            <p className="text-sm text-gray-500 mt-1 break-words">
              {document?.data?.fileName ||
                document?.data?.title ||
                "PDF Document"}
            </p>

          </div>

          {/* Open PDF */}

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full
              sm:w-auto
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-lg
              border
              border-teal-200
              text-teal-600
              hover:bg-teal-50
              font-medium
              text-sm
              flex-shrink-0
            "
          >
            <ExternalLink size={17} />

            Open in new tab
          </a>

        </div>

        {/* =====================================================
            PDF VIEWER
        ===================================================== */}

        <div className="w-full bg-gray-100">

          <div
            className="
              w-full
              h-[60vh]
              min-h-[450px]
              sm:h-[65vh]
              md:h-[70vh]
              lg:h-[75vh]
            "
          >

            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
            >

              {/* =================================================
                  MOBILE / BROWSER FALLBACK
              ================================================= */}

              <div
                className="
                  w-full
                  h-full
                  min-h-[450px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-white
                  p-6
                  text-center
                "
              >

                <div className="mb-4">

                  <div
                    className="
                      w-16
                      h-16
                      mx-auto
                      rounded-xl
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      text-2xl
                    "
                  >
                    📄
                  </div>

                </div>

                <h3 className="text-lg font-semibold text-gray-700">
                  {document?.data?.fileName || "PDF Document"}
                </h3>

                <p className="text-sm text-gray-500 mt-2 mb-5">
                  Your PDF is ready to view.
                </p>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-teal-600
                    hover:bg-teal-700
                    text-white
                    px-6
                    py-3
                    rounded-lg
                    font-medium
                    text-sm
                  "
                >
                  <ExternalLink size={18} />

                  Open PDF
                </a>

              </div>

            </object>

          </div>

        </div>

      </div>
    );
  };

  // =========================================================
  // CHAT
  // =========================================================

  const renderChat = () => {
    return (
      <div className="w-full">
        <ChatInterface documentId={id} />
      </div>
    );
  };

  // =========================================================
  // AI ACTIONS
  // =========================================================

  const renderAIActions = () => {
    return (
      <div className="w-full">
        <AIActions documentId={id} />
      </div>
    );
  };

  // =========================================================
  // FLASHCARDS
  // =========================================================

  const renderFlashcardsTab = () => {
    return (
      <div className="w-full">
        <FlashcardManager documentId={id} />
      </div>
    );
  };

  // =========================================================
  // QUIZZES
  // =========================================================

  const renderQuizzesTab = () => {
    return (
      <div className="w-full">
        <QuizManager documentId={id} />
      </div>
    );
  };

  // =========================================================
  // TABS
  // =========================================================

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

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // =========================================================
  // DOCUMENT NOT FOUND
  // =========================================================

  if (!document || !document.data) {
    return (
      <div
        className="
          w-full
          min-h-[70vh]
          flex
          flex-col
          items-center
          justify-center
          px-4
          text-center
        "
      >

        <h2 className="text-xl font-semibold text-gray-700">
          Document not found
        </h2>

        <Link
          to="/documents"
          className="
            mt-4
            flex
            items-center
            gap-2
            text-teal-600
            hover:text-teal-700
          "
        >
          <ArrowLeft size={18} />

          Back to Documents
        </Link>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div
      className="
        w-full
        max-w-7xl
        mx-auto
        px-2
        sm:px-4
        md:px-6
        py-4
        sm:py-6
        overflow-x-hidden
      "
    >

      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        to="/documents"
        className="
          inline-flex
          items-center
          gap-2
          text-gray-600
          hover:text-teal-600
          mb-4
          sm:mb-5
          text-sm
          sm:text-base
        "
      >
        <ArrowLeft size={18} />

        Back to Documents
      </Link>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="w-full overflow-hidden">
        <PageHeader
          title={document?.data?.title || "Document"}
        />
      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="mt-4 sm:mt-6 w-full">

        <div className="w-full overflow-x-auto">

          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

        </div>

      </div>

    </div>
  );
};

export default DocumentDetailPage;
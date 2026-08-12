import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
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

  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Content");

  // =========================================================
  // FETCH DOCUMENT
  // =========================================================

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);

        const response = await documentService.getDocumentById(id);

        console.log("========== DOCUMENT RESPONSE ==========");
        console.log(response);
        console.log("=======================================");

        setDocument(response);
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

    /*
      Depending on your backend, the URL may be stored
      under one of these fields.
    */

    const filePath =
      document?.data?.filePath ||
      document?.data?.fileUrl ||
      document?.data?.cloudinaryUrl ||
      document?.filePath ||
      document?.fileUrl ||
      document?.cloudinaryUrl ||
      "";

    console.log("========== PDF URL ==========");
    console.log(filePath);
    console.log("=============================");

    if (!filePath) {
      console.error("No PDF URL found.");

      setPdfUrl("");
      setPdfLoading(false);
      return;
    }

    // =======================================================
    // PREVENT DOCUMENT PAGE FROM BEING LOADED IN IFRAME
    // =======================================================

    const currentOrigin = window.location.origin;

    if (
      filePath.startsWith(currentOrigin) &&
      (
        filePath.includes("/documents/") ||
        filePath.includes("/document/")
      )
    ) {
      console.error(
        "ERROR: filePath is pointing to the React document page instead of the actual PDF."
      );

      console.error("Received URL:", filePath);

      setPdfUrl("");
      setPdfLoading(false);

      return;
    }

    setPdfUrl(filePath);
    setPdfLoading(false);
  }, [document]);

  // =========================================================
  // CONTENT TAB
  // =========================================================

  const renderContent = () => {
    // -----------------------------------------------
    // LOADING
    // -----------------------------------------------

    if (pdfLoading) {
      return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Spinner />

              <p className="mt-4 text-sm sm:text-base text-gray-500">
                Loading PDF...
              </p>
            </div>
          </div>
        </div>
      );
    }

    // -----------------------------------------------
    // NO PDF
    // -----------------------------------------------

    if (!pdfUrl) {
      return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center px-5 py-20">

            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText
                size={30}
                className="text-gray-400"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              PDF cannot be displayed
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-md">
              The document URL is not pointing to the actual PDF file.
              Please check the Cloudinary file URL saved in the database.
            </p>

          </div>
        </div>
      );
    }

    // =====================================================
    // PDF VIEWER
    // =====================================================

    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            w-full
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            p-4
            sm:p-5
            border-b
            border-gray-200
          "
        >

          {/* DOCUMENT DETAILS */}

          <div className="min-w-0 flex-1">

            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Document Viewer
            </h2>

            <p className="mt-1 text-sm text-gray-500 break-words">
              {document?.data?.fileName ||
                document?.data?.title ||
                "PDF Document"}
            </p>

          </div>

          {/* OPEN PDF */}

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full
              sm:w-auto
              shrink-0
              inline-flex
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
              hover:border-teal-300
              font-medium
              text-sm
              transition
            "
          >
            <ExternalLink size={17} />

            <span>Open in new tab</span>
          </a>

        </div>

        {/* =================================================
            PDF CONTAINER
        ================================================= */}

        <div className="w-full bg-gray-100 p-0">

          <div
            className="
              w-full
              h-[60vh]
              min-h-[450px]
              sm:h-[65vh]
              md:h-[70vh]
              lg:h-[75vh]
              xl:h-[80vh]
            "
          >

            <iframe
              src={pdfUrl}
              title={
                document?.data?.title ||
                document?.data?.fileName ||
                "PDF Viewer"
              }
              className="
                block
                w-full
                h-full
                border-0
              "
              loading="lazy"
            />

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
      <div className="w-full min-w-0">
        <ChatInterface documentId={id} />
      </div>
    );
  };

  // =========================================================
  // AI ACTIONS
  // =========================================================

  const renderAIActions = () => {
    return (
      <div className="w-full min-w-0">
        <AIActions documentId={id} />
      </div>
    );
  };

  // =========================================================
  // FLASHCARDS
  // =========================================================

  const renderFlashcardsTab = () => {
    return (
      <div className="w-full min-w-0">
        <FlashcardManager documentId={id} />
      </div>
    );
  };

  // =========================================================
  // QUIZZES
  // =========================================================

  const renderQuizzesTab = () => {
    return (
      <div className="w-full min-w-0">
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
  // MAIN LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
        <Spinner />
      </div>
    );
  }

  // =========================================================
  // DOCUMENT NOT FOUND
  // =========================================================

  if (!document || !document.data) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          Document not found
        </h2>

        <Link
          to="/documents"
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            text-teal-600
            hover:text-teal-700
            text-sm
            sm:text-base
          "
        >
          <ArrowLeft size={18} />

          Back to Documents
        </Link>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
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

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <Link
        to="/documents"
        className="
          inline-flex
          items-center
          gap-2
          mb-4
          sm:mb-5
          text-sm
          sm:text-base
          text-gray-600
          hover:text-teal-600
        "
      >
        <ArrowLeft size={18} />

        Back to Documents
      </Link>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="w-full min-w-0 overflow-hidden">

        <PageHeader
          title={document?.data?.title || "Document"}
        />

      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="mt-4 sm:mt-6 w-full min-w-0">

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
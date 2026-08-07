import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Trash2,
  FileText,
  X,
  AlertTriangle,
  Bell,
  User,
} from "lucide-react";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch Documents");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);

    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center max-w-md animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg mb-6">
              <FileText
                className="w-10 h-10 text-slate-400"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Documents Yet
            </h3>
            <p className="text-sm text-slate-500 mb-8">
              Your library is empty. Upload your first PDF to start learning.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Upload First Document
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header></Header>
      <div className="flex min-h-screen bg-white overflow-hidden">
        {/* 1. Sidebar Component */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* 2. Main Content - md:ml-64 shifts it to the right of the Sidebar */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 transition-all duration-300">
          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-10 relative">
            <div className="max-w-[1400px]">
              {/* Header Content */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                <div>
                  <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
                    My Documents
                  </h1>
                  <p className="text-slate-500 text-[15px] mt-1">
                    Manage and organize your learning materials
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-xl text-white flex items-center gap-2 transition-all shadow-sm"
                >
                  <Plus size={20} strokeWidth={3} />
                  Upload Document
                </button>
              </div>

              {/* Grid Content */}
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Existing Modal Logic (Remains unchanged) */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsUploadModalOpen(false)}
            />
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Upload Document
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    PDF files only, max 10MB
                  </p>
                </div>
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required
                      className="w-full h-12 px-4 border-2 border-slate-100 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                      placeholder="e.g. Chemistry Notes"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      File Selection
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-400 transition-colors group">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {uploadFile ? (
                            <span className="text-emerald-600">
                              {uploadFile.name}
                            </span>
                          ) : (
                            "Click or drag PDF here"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="flex-1 h-12 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 h-12 rounded-xl bg-[#10B981] text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20"
                    >
                      {uploading ? "Uploading..." : "Confirm Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 ">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Delete Document
                  </h3>
                  <p className="text-slate-500 text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{selectedDoc?.title}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
                >
                  Keep it
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentListPage;

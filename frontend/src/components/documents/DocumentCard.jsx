import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (!bytes) return "N/A";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/documents/${document._id}`)}
      className="
      group
      relative
      bg-white
      border border-slate-200
      rounded-xl
      p-4
      w-full
      max-w-[240px]
      shadow-sm
      hover:shadow-md
      hover:border-emerald-300
      transition
      cursor-pointer
      flex flex-col
      "
    >
      {/* Top */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-emerald-600" />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document);
          }}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1"
        title={document.title}
      >
        {document.title}
      </h3>

      {/* Size */}
      <p className="text-xs text-slate-500 mb-3">
        {formatFileSize(document.fileSize)}
      </p>

      {/* Stats */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded">
            <BookOpen className="w-3 h-3" />
            {document.flashcardCount}
          </div>
        )}

        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
            <BrainCircuit className="w-3 h-3" />
            {document.quizCount}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center text-[10px] text-slate-400 gap-1">
        <Clock className="w-3 h-3" />
        {moment(document.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default DocumentCard;

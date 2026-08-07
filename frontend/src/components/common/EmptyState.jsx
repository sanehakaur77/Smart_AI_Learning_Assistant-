import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/60 shadow-sm sm:px-12">
      {/* Icon */}
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-blue-100 text-blue-600 shadow-inner">
        <FileText className="w-10 h-10" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:text-2xl">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-sm mb-6 sm:text-base">
        {description}
      </p>

      {/* Action Button */}
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

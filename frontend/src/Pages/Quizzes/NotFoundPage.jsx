import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-lg">
        {/* Image */}
        <img
          src="./NotFound.avif"
          alt="404 Not Found"
          className="w-50 mx-auto mb-6"
        />

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <AlertTriangle size={40} className="text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-slate-800 mb-2">404</h1>

        {/* Subtitle */}
        <h2 className="text-xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-500 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { ExternalLink } from "lucide-react";

const Tabs = ({ tabs, activeTab, setActiveTab, pdfUrl }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTabData = tabs.find((tab) => tab.name === activeTab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Tabs Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <nav className="flex gap-8 px-8 pt-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative pb-3 text-sm font-semibold transition-colors
                ${
                  activeTab === tab.name
                    ? "text-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}

                {activeTab === tab.name && (
                  <span className="absolute left-0 bottom-0 w-full h-[3px] bg-emerald-500 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col">
            {/* Document Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-700">
                Document Viewer
              </h2>

              {activeTab === "content" && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  Open in new tab
                </a>
              )}
            </div>

            {/* Viewer */}
            <div className="flex-1 bg-gray-200 p-4">
              {activeTab === "content" ? (
                <div className="w-full h-full bg-black rounded-md overflow-hidden">
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    title="PDF Viewer"
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                <div className="p-6 overflow-y-auto h-full">
                  {activeTabData?.content}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;

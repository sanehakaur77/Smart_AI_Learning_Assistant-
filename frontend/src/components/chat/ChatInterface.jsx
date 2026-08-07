import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  Sparkles,
  User,
  Sparkle,
  Info,
} from "lucide-react";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import MarkdownRenderer from "../../components/common/MarkDownRenderer";

const ChatInterface = ({ documentId }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting to the document server. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex max-w-[85%] md:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm font-bold text-xs ${
              isUser
                ? "bg-white border-teal-600 text-teal-600"
                : "bg-teal-600 border-teal-600 text-white"
            }`}
          >
            {isUser ? (
              user?.name?.charAt(0) || <User size={16} />
            ) : (
              <Sparkles size={18} />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm border ${
                isUser
                  ? "bg-teal-50 text-black rounded-tr-none border-teal-200"
                  : "bg-white text-black rounded-tl-none border-slate-200"
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
              ) : (
                <div className="prose prose-sm max-w-none prose-headings:text-black prose-p:text-black">
                  <MarkdownRenderer content={msg.content} />
                </div>
              )}
            </div>
            <span className="text-[10px] mt-1 text-slate-500 font-bold px-1 uppercase tracking-tighter">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl border border-slate-200">
        <Spinner className="text-teal-600 w-10 h-10" />
        <p className="mt-4 text-black font-semibold text-sm">Syncing Data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <MessageSquare size={20} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-black uppercase tracking-tight">
              Knowledge Assistant
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Active
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-teal-600 transition-colors">
          <Info size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 bg-white border border-teal-100 rounded-3xl flex items-center justify-center text-teal-600 shadow-xl mb-6">
              <Sparkles size={36} />
            </div>
            <h3 className="text-xl font-black text-black tracking-tight">
              Ready to analyze.
            </h3>
            <p className="text-slate-600 text-sm mt-2 max-w-xs mx-auto leading-relaxed font-medium">
              Ask questions about the uploaded document for instant insights.
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {loading && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white">
              <Sparkle size={18} className="animate-spin-slow" />
            </div>
            <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={handleSendMessage}
          className="relative group max-w-5xl mx-auto"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
            className="w-full bg-white border-2 border-slate-100 text-black font-medium pl-5 pr-14 py-4 rounded-2xl outline-none focus:border-teal-500 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white rounded-xl transition-all shadow-md shadow-teal-900/10"
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </form>
        <p className="text-center text-[9px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
          End-to-End Encrypted Assistant
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;

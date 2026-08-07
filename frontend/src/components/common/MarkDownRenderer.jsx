import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-bold mt-6 mb-4 text-gray-900"
              {...props}
            />
          ),

          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl font-semibold mt-5 mb-3 text-gray-900"
              {...props}
            />
          ),

          h3: ({ node, ...props }) => (
            <h3
              className="text-xl font-semibold mt-4 mb-2 text-gray-900"
              {...props}
            />
          ),

          h4: ({ node, ...props }) => (
            <h4
              className="text-lg font-semibold mt-3 mb-2 text-gray-800"
              {...props}
            />
          ),

          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-3" {...props} />
          ),

          a: ({ node, ...props }) => (
            <a
              className="text-teal-600 hover:text-teal-700 underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-6 mb-3 space-y-1 text-gray-700"
              {...props}
            />
          ),

          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 mb-3 space-y-1 text-gray-700"
              {...props}
            />
          ),

          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),

          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),

          em: ({ node, ...props }) => (
            <em className="italic text-gray-700" {...props} />
          ),

          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-teal-500 pl-4 italic text-gray-600 my-3"
              {...props}
            />
          ),

          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                className="rounded-lg my-4 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          pre: ({ node, ...props }) => (
            <pre
              className="bg-gray-900 rounded-lg p-4 overflow-x-auto my-4"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

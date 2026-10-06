import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface RichTextProps {
  content: string;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`rich-text-content ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Render HTML & Markdown elements cleanly
          p: ({ children }) => <p className="mb-2 last:mb-0 inline-block leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-extrabold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          sub: ({ children }) => (
            <sub className="text-[0.75em] leading-none align-baseline relative -bottom-[0.2em] font-semibold">
              {children}
            </sub>
          ),
          sup: ({ children }) => (
            <sup className="text-[0.75em] leading-none align-baseline relative -top-[0.4em] font-semibold">
              {children}
            </sup>
          ),
          code: ({ className, children, ...props }: any) => {
            const isInline = !className && !String(children).includes('\n');
            if (isInline) {
              return (
                <code
                  className="bg-slate-100 text-indigo-700 font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded border border-slate-200"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-slate-700 overflow-x-auto my-2">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
          li: ({ children }) => <li className="text-slate-800">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-3 italic text-slate-600 my-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

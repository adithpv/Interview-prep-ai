import { LuCode, LuCopy, LuCheck } from "react-icons/lu";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const AiResponsePreview = ({ content }: { content: string }) => {
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="prose prose-slate max-w-none text-[14px] text-gray-900 [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0">
        <ReactMarkDown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className;

              if (isInline) {
                return (
                  <code
                    className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-900"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="my-4">
                  <CodeBlock
                    code={String(children).replace(/\n$/, "")}
                    language={language}
                  />
                </div>
              );
            },
            p({ children }) {
              return <p className="mb-4 leading-6 text-gray-900">{children}</p>;
            },
            strong({ children }) {
              return <strong>{children}</strong>;
            },
            em({ children }) {
              return <em>{children}</em>;
            },
            ul({ children }) {
              return (
                <ul className="my-4 list-disc space-y-2 pl-6 text-gray-900">
                  {children}
                </ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="my-4 list-decimal space-y-2 pl-6 text-gray-900">
                  {children}
                </ol>
              );
            },
            li({ children }) {
              return <li className="mb-1 text-gray-900">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-4 border-l-4 border-gray-200 pl-4 text-gray-700 italic">
                  {children}
                </blockquote>
              );
            },
            h1({ children }) {
              return (
                <h1 className="mt-6 mb-4 text-2xl font-bold text-gray-900">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="mt-6 mb-3 text-xl font-bold text-gray-900">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="mt-5 mb-2 text-lg font-bold text-gray-900">
                  {children}
                </h3>
              );
            },
            h4({ children }) {
              return (
                <h4 className="mt-4 mb-2 text-base font-bold text-gray-900">
                  {children}
                </h4>
              );
            },
            a({ children, href }) {
              return (
                <a className="text-blue-600 hover:underline" href={href}>
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="my-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300 border border-gray-200">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-gray-50">{children}</thead>;
            },
            tbody({ children }) {
              return (
                <tbody className="divide-y divide-gray-200">{children}</tbody>
              );
            },
            tr({ children }) {
              return <tr className="text-gray-900">{children}</tr>;
            },
            th({ children }) {
              return (
                <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-900">
                  {children}
                </td>
              );
            },
            hr() {
              return <hr className="my-6 border-gray-200" />;
            },
            img({ src, alt }) {
              return (
                <img src={src} alt={alt} className="my-4 max-w-full rounded" />
              );
            },
          }}
        >
          {content}
        </ReactMarkDown>
      </div>
    </div>
  );
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="border-gray-20 relative my-6 overflow-hidden rounded-lg border bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2">
        <div className="flex items-center space-x-2">
          <LuCode size={16} className="text-gray-500" />
          <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
            {language || "Code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="hover:gray-700 relative text-gray-500 focus:outline-none"
          aria-label="Copy code"
        >
          {copied ? (
            <LuCheck className="text-green-600" size={16} />
          ) : (
            <LuCopy size={16} />
          )}
          {copied && (
            <span className="absolute -top-0 right-0 rounded-md bg-black px-2 py-1 text-xs text-white opacity-80 transition group-hover:opacity-100">
              Copied!
            </span>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 12.5,
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AiResponsePreview;

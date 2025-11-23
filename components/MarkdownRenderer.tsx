import React from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase">{language || '代码'}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="复制代码"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar p-4">
        <pre className="text-sm font-mono leading-relaxed text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // A very simple parser to split code blocks from text
  // This avoids heavy dependencies like react-markdown for this demo
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-slate-700 space-y-4 leading-7">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          if (match) {
            const [, language, code] = match;
            return <CodeBlock key={index} language={language} code={code.trim()} />;
          }
          return null;
        }

        // Basic formatting for non-code parts
        // Handle bolding **text** and headings #
        const lines = part.split('\n');
        return (
          <div key={index}>
            {lines.map((line, i) => {
              if (line.trim() === '') return <br key={i} />;
              
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3 border-b border-slate-200 pb-1">{line.replace('## ', '')}</h2>;
              }
               if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 list-disc marker:text-indigo-500">{parseBold(line.replace('- ', ''))}</li>;
              }
               if (line.match(/^\d+\. /)) {
                return <div key={i} className="ml-4 flex gap-2"><span className="font-bold text-indigo-600">{line.split('.')[0]}.</span> <span>{parseBold(line.replace(/^\d+\. /, ''))}</span></div>;
              }

              return <p key={i} className="mb-2">{parseBold(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// Helper to handle bold syntax **text**
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    // Handle inline code `text`
    const codeParts = part.split(/(`.*?`)/g);
    if (codeParts.length > 1) {
         return codeParts.map((cp, j) => {
             if (cp.startsWith('`') && cp.endsWith('`')) {
                 return <code key={`${i}-${j}`} className="bg-slate-100 text-pink-600 font-mono text-sm px-1 py-0.5 rounded border border-slate-200">{cp.slice(1, -1)}</code>
             }
             return <span key={`${i}-${j}`}>{cp}</span>
         })
    }
    return <span key={i}>{part}</span>;
  });
};
import { parseMarkdown } from '@/lib/markdown';

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent = ({ content }: MarkdownContentProps) => {
  const htmlContent = parseMarkdown(content);

  return (
    <article
      className="prose prose-lg max-w-none
        prose-headings:font-light prose-headings:text-gray-900
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-medium
        prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg
        prose-pre:overflow-x-auto
        prose-img:rounded-lg prose-img:shadow-md
        prose-ul:list-disc prose-ul:pl-6
        prose-ol:list-decimal prose-ol:pl-6
        prose-li:text-gray-700
        prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:italic
        prose-hr:border-gray-200
        prose-table:border-collapse
        prose-th:border prose-th:border-gray-300 prose-th:p-2
        prose-td:border prose-td:border-gray-300 prose-td:p-2"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownContent;
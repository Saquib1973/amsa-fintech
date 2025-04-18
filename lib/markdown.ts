import { marked } from 'marked';

export function parseMarkdown(content: string) {
  return marked(content, {
    gfm: true,
    breaks: true,
  });
}
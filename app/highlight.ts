import { createHighlighter } from 'shiki';
import { load } from 'cheerio';

const highlighter = await createHighlighter({
  themes: ['everforest-light', 'everforest-dark'],
  langs: ['javascript', 'typescript', 'clojure', 'lua', 'coffeescript', 'csharp', 'ruby', 'bash', 'json', 'html', 'css', 'swift', 'xml'],
});

const langMap: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'cs': 'csharp',
};

export const highlightCodeBlocks = (html: string, defaultLanguages?: string[]): string => {
  const $doc = load(html);

  $doc('pre code').each((_, el) => {
    const $code = $doc(el);
    const $pre = $code.parent();

    // Extract language from class (e.g., "language-js" or "js")
    const classAttr = $code.attr('class') || '';
    const langMatch = classAttr.match(/(?:language-)?(\w+)/);
    let lang = langMatch ? langMatch[1] : null;

    // Map common aliases
    if (lang && langMap[lang]) {
      lang = langMap[lang];
    }

    // Fall back to post's default languages if no language specified
    if (!lang && defaultLanguages?.length) {
      const firstLang = defaultLanguages[0];
      lang = langMap[firstLang] || firstLang;
    }

    // Get the code content (decode HTML entities)
    const code = $code.text();

    try {
      const highlighted = highlighter.codeToHtml(code, {
        lang: lang || 'text',
        themes: {
          light: 'everforest-light',
          dark: 'everforest-dark',
        },
      });
      $pre.replaceWith(highlighted);
    } catch {
      // If highlighting fails (unknown language), leave as-is
    }
  });

  return $doc.html() || html;
};

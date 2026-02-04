import fse from 'fs-extra';
import type { Post } from './posts.ts';
import showdown from 'showdown';
import { highlightCodeBlocks } from './highlight.ts';
import { load } from 'cheerio';

const { Converter } = showdown;
const _converter = new Converter();

const { readFileSync } = fse;

export default function renderPost(post: Post) : Post {
  const markdown = readFileSync('./content/posts/' + post.filename).toString();
  const rawHtml = _converter.makeHtml(markdown);
  const highlightedHtml = highlightCodeBlocks(rawHtml, post.languages);

  return Object.assign({}, post, {
    body: highlightedHtml,
    filename: post.filename.replace('.md', '.html'),
  });
}

export function renderAbout() : string {
  const markdown = readFileSync('./content/about.md').toString();
  const html = _converter.makeHtml(markdown);
  return html;
}

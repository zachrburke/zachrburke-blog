import showdown from 'showdown';
const { Converter } = showdown;
import * as templates from './templates.ts';
import posts, { recentPosts }  from './posts.ts';
import type { Post } from './posts.ts'
import fse from 'fs-extra';
const { readFileSync, removeSync, mkdirSync, writeFileSync, copySync } = fse;
import { load } from 'cheerio';
import type { Cheerio } from 'cheerio';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import type { AnyNode } from 'domhandler';
import { highlightCodeBlocks } from './highlight.ts';
import { fetchCurrentlyReading } from './currentlyReading.ts';

const currentlyReading = await fetchCurrentlyReading();
console.log('Currently reading:', JSON.stringify(currentlyReading, null, 2));

const layout = readFileSync('./app/index.html').toString();
const $ = load(layout);

const applyTo = (selector: string) => {
  return function (content: string | Cheerio<AnyNode>) {
    $(selector).html(content);
  };
}

const getPostWithBody = (post: Post) => {
  const markdown = readFileSync('./content/posts/' + post.filename).toString();
  const converter = new Converter();
  const rawHtml = converter.makeHtml(markdown);
  const highlightedHtml = highlightCodeBlocks(rawHtml, post.languages);

  return Object.assign({}, post, {
    body: highlightedHtml,
    filename: post.filename.replace('.md', '.html'),
  });
}

const convertMdFile = (path: string) => {
  const markdown = readFileSync(path).toString();
  return new Converter().makeHtml(markdown);
}

removeSync('./dist');

mkdirSync('./dist/');
mkdirSync('./dist/blog/');
mkdirSync('./dist/static');

const about = convertMdFile("./content/about.md");
applyTo('main')(templates.home(posts, recentPosts, about, currentlyReading));
writeFileSync('./dist/index.html', $.html());

posts.concat(recentPosts).forEach(post => {
  const postWithBody = getPostWithBody(post);
  console.log('Creating Page for', postWithBody.filename);

  applyTo('main')(templates.post(postWithBody));
  $('title').text(post.title);
  writeFileSync('./dist/blog/' + postWithBody.filename, $.html());
});

copySync('./content/', './dist/content');
copySync('./favicon.png', './dist/favicon.png');

const css = readFileSync('./app/index.css').toString();
postcss([ autoprefixer ]).process(css).then(function (result) {
  result.warnings().forEach(function (warn) {
    console.warn(warn.toString());
  });
  writeFileSync('./dist/static/styles.css', result.css);
});

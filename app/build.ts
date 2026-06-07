import fse from "fs-extra";
import { load } from "cheerio";
import type { Cheerio } from "cheerio";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import type { AnyNode } from "domhandler";

import * as templates from "./templates.ts";
import posts, { recentPosts } from "./posts.ts";
import { fetchCurrentlyReading } from "./currentlyReading.ts";
import renderPost, { renderAbout } from "./renderer.ts";
import feed from "./feed.ts";
import { logger } from "./diagnostics.ts";
import { copyFileSync, cpSync } from "node:fs";

const html = String.raw;

const { readFileSync, removeSync, mkdirSync, writeFileSync, copySync } = fse;

const currentlyReading = await fetchCurrentlyReading();
logger.info("Currently reading: %s", JSON.stringify(currentlyReading, null, 2));

const layout = readFileSync("./app/index.html").toString();
const $ = load(layout);

const applyTo = (selector: string) => {
  return function(content: string | Cheerio<AnyNode>) {
    $(selector).html(content);
  };
};

removeSync("./dist");

mkdirSync("./dist/");
mkdirSync("./dist/blog/");
mkdirSync("./dist/static");

const about = renderAbout();
applyTo("main")(templates.home(posts, recentPosts, about, currentlyReading));
writeFileSync("./dist/index.html", $.html());

posts.concat(recentPosts).forEach((post) => {
  const postWithBody = renderPost(post);
  logger.info("Creating Page for %s", postWithBody.filename);

  applyTo("main")(templates.post(postWithBody));
  $("title").text(post.title);
  if (postWithBody.at_uri != null) {
    logger.info("Adding at_uri link for %s", postWithBody.filename)
    $("head").append(html`
      <link
        rel="site.standard.document"
        href="${postWithBody.at_uri}"
      />`
    );
  }
  writeFileSync("./dist/blog/" + postWithBody.filename, $.html());
});

copySync("./content/", "./dist/content");
copySync("./favicon.png", "./dist/favicon.png");

const css = readFileSync("./app/index.css").toString();
postcss([autoprefixer])
  .process(css)
  .then(function(result) {
    result.warnings().forEach(function(warn) {
      logger.warn(warn.toString());
    });
    writeFileSync("./dist/static/styles.css", result.css);
  });

const feedXml = feed.rss2();
writeFileSync("./dist/feed.xml", feedXml, "utf8");
logger.info("Feed written to feed.xml");

cpSync("app/.well-known/", "dist/.well-known/", { recursive: true });
logger.info("Copied .well-known directory");

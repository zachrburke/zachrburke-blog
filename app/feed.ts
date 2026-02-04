import { Feed } from "feed";
import type { Post } from './posts.ts';
import posts, { recentPosts } from './posts.ts';
import renderPost from './renderer.ts';

const lastUpdatedMilli = Date.parse(recentPosts[0].pub_date);

const feed = new Feed({
  title: "Zach R. Burke",
  description: "Recent content from my personal blog",
  id: "https://zachrburke.com",
  link: "https://zachrburke.com/",
  language: "en",
  image: "https://zachrburke.com/favicon.png",
  favicon: "https://zachrburke.com/favicon.png",
  copyright: "All rights reserved 2014, Zach Burke",
  updated: new Date(lastUpdatedMilli),
  feedLinks: {
    rss: "https://zachrburke.com/feed.xml"
  },
  author: {
    name: "Zach Burke",
    link: "https://bsky.app/profile/zbeastly1.bsky.social",
  },
});

const allPosts = [...recentPosts, ...posts];
const getPostUrl = (post: Post) => `https://zachrburke.com/blog/${post.slug}`;

allPosts.forEach((post) => {
  const pubDateMili = Date.parse(post.pub_date);
  feed.addItem({
    title: post.title,
    id: getPostUrl(post),
    link: getPostUrl(post),
    description: renderPost(post).body,
    date: new Date(pubDateMili),
  });
});

feed.addCategory("Technology");

export default feed;


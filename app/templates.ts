import type { Post } from "./posts.ts";

const html = String.raw;

const $each = <T>(list: T[], callback: (item: T) => string) =>
    list.map(callback).join('');

export function post(post: Post) {
  return html`
    <div class='metadata'>
      <h1>${post.title}</h1>
      <small>${post.pub_date}</small>
    </div>
    <article class="post">${post.body}</article>
`;
}

export function home(posts: Post[], about: string) {
  return html`
    <div class="about">
      ${about}
    </div>
    ${archive(posts)}
  `;
}

export function archive(posts: Post[]) {
  return html`
    <div class="archive">
      <h5>Archive</h5>
      <hr />
      ${$each(posts, (post: Post) => `
        <div class="headline">
          <h5>
            <a href="/blog/${post.slug}">${post.title}</a>
          </h5>
          <span class="meta">
            <small>${post.pub_date}</small>
            <pre>${post.languages?.join(', ') ?? ''}</pre>
          </span>
        </div>
      `)}
    </div>
`;
}


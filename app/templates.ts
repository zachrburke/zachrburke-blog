import type { Post } from "./posts.ts";
import type { CurrentlyReadingData, Book } from "./currentlyReading.ts";

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

export function home(posts: Post[], recentPosts: Post[], about: string, reading: CurrentlyReadingData) {
  return html`
    <div class="about">
      ${about}
    </div>
    ${recent(recentPosts)}
    ${currentlyReading(reading)}
    ${archive(posts)}
  `;
}

export function headline(post: Post) {
  return html`
    <div class="headline">
      <h5>
        <a href="/blog/${post.slug}">${post.title}</a>
      </h5>
      <span class="meta">
        <small>${post.pub_date}</small>
        <pre>${post.languages?.join(', ') ?? ''}</pre>
      </span>
    `;
}

export function archive(posts: Post[]) {
  return html`
    <div class="archive">
      <h5>Archive</h5>
      <hr />
      ${$each(posts, (post: Post) => headline(post))}
    </div>
`;
}

export function recent(posts: Post[]) {
  return html`
    <div class="recent-posts">
      <h5>Recent Posts</h5>
      <hr />
      ${$each(posts, (post: Post) => headline(post))}
    </div>
  `;
}

function bookCard(book: Book) {
  const percent = book.pages > 0 ? Math.round((book.currentPage / book.pages) * 100) : 0;

  return html`
    <div class="book">
      <img src="${book.imageUrl}" alt="${book.title}" />
      <div class="book-info">
        <span class="book-title">${book.title}</span>
        <div class="progress">
          <div class="progress-bar" style="width: ${percent}%"></div>
        </div>
        <small>${book.currentPage} / ${book.pages} pages (${percent}%)</small>
      </div>
    </div>
  `;
}

export function currentlyReading(data: CurrentlyReadingData) {
  return html`
    <div class="currently-reading">
      <h5>Currently Reading</h5>
      <hr />
      ${data.books.length > 0
        ? $each(data.books, bookCard)
        : '<p>Nothing right now, send me a recommendation!</p>'}
    </div>
  `;
}

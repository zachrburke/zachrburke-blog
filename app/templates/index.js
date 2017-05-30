import { $each, $if } from './helpers';

export function applyTo(query) {
    return function(template) {
        document.querySelector(query).innerHTML = template;
    }
}

export default {
    post: function(post) {
        return `
            <div class='metadata'>
                <h1>${post.title}</h1>
                <small>${post.pub_date}</small>
            </div>
            <article>${post.body}</article>
        `
    },

    archive: function (posts) {
        return `
            <h5>Archive</h5>
            <hr />
            ${$each(posts, post => `
                <div class="headline">
                    <a href="/blog/${post.slug}">${post.title}</a>
                </div>
            `)}
        `
    }
}
import { $each, $if } from './helpers';
import posts from '../posts';

function archive() {
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

export default function(post) {
    return `
        <section>
            <div class='metadata'>
                <h1>${post.title}</h1>
                <small>Published ${post.pub_date}</small>
            </div>
            <article>${post.body}</article>
        </section>
        <aside>
            <section class='about'>
                <h5>About Me</h5>
                <hr/>
                <p>
                    I am a .NET developer that likes to tinker in lua and other languages.  I make games too!
                    <a href='/me/about'>read more</a>
                </p>
                <ul>
                    <li>
                        <a href="http://feedburner.google.com/fb/a/mailverify?uri=ThrowUpRss&amp;loc=en_US" target="_blank">Get email updates</a>
                    </li>
                    <li>
                        <a href='http://feeds.feedburner.com/ThrowUpRss' target="_blank">
                            RSS Feed <img class='feedicon' src='/content/images/feed.png' /> 
                        </a>
                    </li>
                </ul>
            </section>
            <section>
                ${archive()}
            </section>
        </aside>
    `
}
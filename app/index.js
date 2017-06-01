import showdown from 'showdown';
import templates, { applyTo } from './templates';
import posts from './posts';
import styles from './index.css';

applyTo('main section.archive')(templates.archive(posts));

var slug = document.location.pathname.replace('/blog/', '');
var post = posts.find((p) => p.slug === slug);

post = slug === '/' ? posts[0] : post;

if (post) {
    fetch(`/content/posts/${post.filename}`)
        .then(res => res.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            post.body = converter.makeHtml(markdown);

            applyTo('main section.post-content')(templates.post(post));
        });
}


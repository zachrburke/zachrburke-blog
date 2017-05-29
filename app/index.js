import showdown from 'showdown';
import templates from './templates';
import posts from './posts';
import styles from './index.css';

var slug = document.location.pathname.replace('/blog/', '');
var post = posts.find((p) => p.slug === slug);

post = slug === '/' ? posts[0] : post;

if (post) {
    fetch(`/public/posts/${post.filename}`)
        .then(res => res.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            post.body = converter.makeHtml(markdown);

            document.querySelector('.body').innerHTML = templates.post(post);
        });
}


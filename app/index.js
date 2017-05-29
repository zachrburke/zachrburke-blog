import showdown from 'showdown';
import templates from './templates';
import posts from './posts';

var headerElem = document.querySelector('.header');
headerElem.innerHTML = templates.header();

document.querySelector('.footer').innerHTML = templates.footer();

var slug = document.location.pathname.replace('/blog/', '');
var post = posts.find((p) => p.slug === slug);

console.log(slug);

if (post) {
    fetch(`/public/posts/${post.filename}`)
        .then(res => res.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            post.body = converter.makeHtml(markdown);

            document.querySelector('.body').innerHTML = templates.post(post);
        });
}


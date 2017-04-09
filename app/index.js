import showdown from 'showdown';
import templates from './templates';

const posts = [
    {
        title: 'Benefits of the Article tag',
        slug: 'benefits-of-article',
        filename: 'benefits-of-article.md',
        pub_date: 'September 11, 2014'
    }
]

var headerElem = document.querySelector('.header');
headerElem.innerHTML = templates.header();

document.querySelector('.footer').innerHTML = templates.footer();

var slug = document.location.hash.substr(1);
var post = posts.find((p) => p.slug === slug);

if (post) {
    fetch(`/public/posts/${post.filename}`)
        .then(res => res.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            post.body = converter.makeHtml(markdown);

            document.querySelector('.body').innerHTML = templates.post(post);
        });
}


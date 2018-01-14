const showdown = require('showdown');
const templates = require('./templates');
const posts = require('./posts');
const fse = require('fs-extra');
const cheerio = require('cheerio');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const layout = fse.readFileSync('./index.html').toString();
const $ = cheerio.load(layout);

const applyTo = (selector) => {
    return function (content) {
        $(selector).html(content);
    };
}

const getPostWithBody = (post) => {
    const markdown = fse.readFileSync('./content/posts/' + post.filename).toString();
    const converter = new showdown.Converter();

    return {
        ...post,
        body: converter.makeHtml(markdown),
        filename: post.filename.replace('.md', '.html'),
    }
}

applyTo('main section.archive')(templates.archive(posts));

if (fse.existsSync('./dist/')) fse.removeSync('./dist/');
fse.mkdirSync('./dist/');
fse.mkdirSync('./dist/blog/');

var latestPost = getPostWithBody(posts[0]);
console.log('Creating home page using', latestPost.filename);

applyTo('main section.post-content')(templates.post(latestPost));
fse.writeFileSync('./dist/index.html', $.html());


posts.forEach(post => {
    const postWithBody = getPostWithBody(post);
    console.log('Creating Page for', postWithBody.filename);

    applyTo('main section.post-content')(templates.post(postWithBody));
    fse.writeFileSync('./dist/blog/' + postWithBody.filename, $.html());
});

fse.copySync('./content/', './dist/content');

fse.mkdirSync('./dist/static');
const css = fse.readFileSync('./app/index.css').toString();

postcss([ autoprefixer ]).process(css).then(function (result) {
    result.warnings().forEach(function (warn) {
        console.warn(warn.toString());
    });
    fse.writeFileSync('./dist/static/styles.css', result.css);
});

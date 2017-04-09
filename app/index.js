import showdown from 'showdown';

function component () {
  var element = document.createElement('div');

  const converter = new showdown.Converter();

  fetch("/public/posts/benefits-of-article.md")
    .then(function(res) {
        return res.text();
    })
    .then(function(data) {
        element.innerHTML = converter.makeHtml(data);
    })

  return element;
}

document.body.appendChild(component());
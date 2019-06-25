const { list, find } = require('../');

const express = require('express');
const router = express();

router.get('/', (req, res) => {
  const posts = list();
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
        )
        .join('')}
    </div>
  </body>
</html>`;
  res.send(html);
});

router.get('/posts/:id', (req, res, next) => {
  try {
    const post = find(req.params.id);
    const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header>
        <img src="/logo.png"/>
        <a href="/">Wizard News</a>
      </header>
      <div class='news-item'>
        <p>
          <span class="news-position"></span>${post.title}
          <small>(by ${post.name})</small>
        </p>
        <p>${post.content}</p>
      </div>
    </div>
  </body>
</html>`;
    res.send(html);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

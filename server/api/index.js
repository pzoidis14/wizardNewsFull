const { postList, postDetails } = require('../../views');
const { client } = require('../');
const express = require('express');
const router = express();

router.get('/', async (req, res) => {
  try {
    const data = await client.query('SELECT * FROM posts');
    const posts = data.rows;
    res.send(postList(posts));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Something went wrong: ${err}`);
  }
});

router.get('/posts/:id', async (req, res, next) => {
  try {
    const data = await client.query('SELECT * FROM posts WHERE ');
    const posts = data.rows;
    res.send(postDetails(posts));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Something went wrong: ${err}`);
  }
});

module.exports = router;

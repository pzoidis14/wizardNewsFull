const { postList, postDetails, addPost } = require('../../views');
const { client } = require('../');
const express = require('express');
const router = express.Router();
const SQL = require('sql-template-strings');

const baseQuery = SQL`
SELECT posts.*, users.name, counting.upvotes
FROM posts
INNER JOIN users
ON users.id = posts.userId
LEFT JOIN (
  SELECT postId,
  COUNT(*) as upvotes
  FROM upvotes
  GROUP BY postId
  ) AS counting
  ON posts.id = counting.postId
`;

router.get('/', async (req, res, next) => {
  try {
    console.log(baseQuery);
    const data = await client.query(baseQuery);
    const posts = data.rows;
    res.send(postList(posts));
  } catch (err) {
    next(err);
  }
});

router.get('/add', (req, res, next) => {
  try {
    res.send(addPost());
  } catch (err) {
    next(err);
  }
});

// router.get('/:id', async (req, res, next) => {
//   try {
//     const data = await client.query(
//       baseQuery + ` WHERE posts.id = ${req.params.id}`
//     );
//     const post = data.rows[0];
//     res.send(postDetails(post));
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/', async (req, res, next) => {
//   try {
//     const { name, title, content } = req.body;
//     let userData = await client.query(
//       `SELECT * FROM users WHERE users.name = $1`,
//       [name]
//     );
//     if (!userData.rows.length) {
//       userData = await client.query(
//         `INSERT INTO users (name) VALUES ($1) RETURNING *`,
//         [name]
//       );
//     }
//     const userId = userData.rows[0].id;
//     const postData = await client.query(
//       `INSERT INTO posts (userId, title, content) VALUES ($1, $2, $3) RETURNING *`,
//       [userId, title, content]
//     );
//     const postId = postData.rows[0].id;
//     await client.query(`INSERT INTO upvotes (userId, postId) VALUES ($1, $2)`, [
//       userId,
//       postId,
//     ]);
//     res.redirect(`/posts/${postId}`);
//   } catch (err) {
//     next(err);
//   }
// });

router.get('/:id', async (req, res, next) => {
  try {
    console.log(`${baseQuery.strings[0]} WHERE posts.id = ${req.params.id}`);
    const data = await client.query(
      SQL`${baseQuery.strings[0]} WHERE posts.id = ${req.params.id}`
    );
    const post = data.rows[0];
    res.send(postDetails(post));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, title, content } = req.body;
    let userData = await client.query(
      `SELECT * FROM users WHERE users.name = $1`,
      [name]
    );
    if (!userData.rows.length) {
      userData = await client.query(
        `INSERT INTO users (name) VALUES ($1) RETURNING *`,
        [name]
      );
    }
    const userId = userData.rows[0].id;
    const postData = await client.query(
      `INSERT INTO posts (userId, title, content) VALUES ($1, $2, $3) RETURNING *`,
      [userId, title, content]
    );
    const postId = postData.rows[0].id;
    await client.query(`INSERT INTO upvotes (userId, postId) VALUES ($1, $2)`, [
      userId,
      postId,
    ]);
    res.redirect(`/posts/${postId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

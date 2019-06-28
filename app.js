const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const PORT = 1337;

app.use(morgan('dev'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/', (req, res) => res.redirect('/posts'));

app.use('/posts', require('./server/api'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send('Post not found!');
});

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

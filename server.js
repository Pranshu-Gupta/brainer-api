const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex({
  client: 'pg',
  connection: {
    connectionString: 'postgres://zysymzgm:c_BPFU6rnOCcJrwQraP66UniHgSRf5Nk@silly.db.elephantsql.com/zysymzgm',
    host: 'silly.db.elephantsql.com',
    port: 5432,
    user: 'zysymzgm',
    database: 'zysymzgm',
    password: 'c_BPFU6rnOCcJrwQraP66UniHgSRf5Nk',
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();

app.use(cors());
app.use(express.json());

db.raw("SELECT 1").then(() => {
    console.log("PostgreSQL connected");
})
.catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
});

app.get('/', (req, res) => {
  res.send('it is working');
});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => {
  console.log(req);
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

const port = process.env.PORT || 3000
app.listen(port , () => {
  console.log(`App is running on ${port}!`);
});

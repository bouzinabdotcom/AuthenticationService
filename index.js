const express = require('express');
const app = express();

const config = require('config'),
      login = require('./routes/login');

const db_user = config.has('db.user') ? config.get('db.user') : "";
const db_pass = config.has('db.pass') ? config.get('db.pass') : "";
require('./database')(db_user, db_pass);


app.use(express.json());


app.use('/login', login);



const port = process.env.AUTH_PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));
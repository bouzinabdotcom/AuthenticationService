const express = require('express');
const app = express();

const config = require('config'),
      login = require('./routes/login'),
      refresh = require('./routes/refresh'),
      access = require('./routes/access'),
      logout = require('./routes/logout');

const db_user = config.has('db.user') ? config.get('db.user') : "";
const db_pass = config.has('db.pass') ? config.get('db.pass') : "";
require('./database')(db_user, db_pass);


app.use(express.json());


app.use('/login', login);
app.use('/refresh', refresh);
app.use('/access', access);
app.use('/logout', logout);






const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));

if(process.env.NODE_ENV='test') module.exports = app;
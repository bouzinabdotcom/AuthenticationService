const express = require('express');
const app = express();

const config = require('config');


const db_user = config.has('db_user') ? config.get('db_user') : "";
const db_pass = config.has('db_pass') ? config.get('db_pass') : "";
require('./database')(db_user, db_pass);


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello world');
});

const port = process.env.AUTH_PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));
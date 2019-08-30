const express = require('express');
const app = express();

require('./database')();


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello world');
});

const port = process.env.AUTH_PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}...`));
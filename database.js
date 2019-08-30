
const mongoose = require('mongoose');
const config = require('config');

module.exports = async function() {
    const db = config.get('app_db');
    const db_user = config.has('db_user') ? config.get('db_user') : "";
    const db_pass = config.has('db_pass') ? config.get('db_pass') : "";

    //add database user and password as environment variables as indicated in the README document.
    const db_con_string = db_user === "" ? `mongodb://localhost:27017/${db}` : `mongodb://${db_user}:${db_pass}@localhost:27017/${db}`;
    console.log(db_con_string);
    try {
        await mongoose.connect(db_con_string, {useNewUrlParser: true});
        console.log("Connected to MongoDB...")
    }
    catch(error) {
        console.log("ERROR: Can't connect to database");
        console.log(error.message);
    }

} ;
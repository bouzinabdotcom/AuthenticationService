
const mongoose = require('mongoose');
const config = require('config');

module.exports = async function(db_user, db_pass) {
    const db_name = config.get('app_db_name');
    const db_host = config.get('app_db_host');
    const db_port = config.get('app_db_port');
    
    

    //add database user and password as environment variables as indicated in the README document.
    const db_con_string = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
    
    try {
        await mongoose.connect(db_con_string, {useNewUrlParser: true});
        console.log("Connected to MongoDB...")
    }
    catch(error) {
        console.log("ERROR: Can't connect to database");
        console.log(error.message);
    }


} ;
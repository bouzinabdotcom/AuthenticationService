
const mongoose = require('mongoose');
const config = require('config');

module.exports = async function(db_user, db_pass) {
    const mongodbUri = config.get("mongoDbUri");
    
    

    //add database user and password as environment variables as indicated in the README document.
    
    try {
        await mongoose.connect(mongodbUri, {useNewUrlParser: true});
        console.log("Connected to MongoDB...")
    }
    catch(error) {
        console.log("ERROR: Can't connect to database");
        console.log(error.message);
    }


} ;
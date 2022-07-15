const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

exports.connect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@tivi14cluster.1bvii.mongodb.net/tivi14?retryWrites=true&w=majority`);
        console.log('database connected')
    } 
    catch (error) {
        console.log('database connect fail')
    }   
}
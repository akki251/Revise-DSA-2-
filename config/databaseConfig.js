const mongoose = require("mongoose");

const connectDb = async () => 
{
    try {
        
        await mongoose.connect(process.env.MONGO_URI), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        }
        console.log("database connected");
    } catch (error) {
        // TODO: handle errors 
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDb;

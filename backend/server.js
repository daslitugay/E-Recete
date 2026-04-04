const app=require('./app');
const dotenv=require('dotenv');
const mongoose=require('mongoose');

dotenv.config();

let isConnected=false;

module.exports=async (req, res) => {
    if (!isConnected) {
        await (async () => {
            try {
                await mongoose.connect(process.env.MONGODB_URI);
            } catch (error) {
                console.error('Error connecting to MongoDB:', error);
            }
        })();
        isConnected = true;
    }

    return app(req, res);
}
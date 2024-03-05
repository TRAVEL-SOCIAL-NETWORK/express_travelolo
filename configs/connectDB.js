const mongoose = require('mongoose');
exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
    
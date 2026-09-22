const mongoose = require("mongoose");
require("dotenv").config({ path: "./backend/.env" });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Atlas connected successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.log("❌ MongoDB connection failed:");
        console.log(error.message);
        process.exit(1);
    });
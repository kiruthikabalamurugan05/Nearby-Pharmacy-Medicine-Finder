const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const db = mongoose.connection.db;

    const indexes = await db.collection("pharmacies").indexes();

    console.log("Current indexes:");
    console.log(indexes);

    const emailIndex = indexes.find(
      (index) => index.name === "email_1"
    );

    if (emailIndex) {
      await db.collection("pharmacies").dropIndex("email_1");

      console.log("✅ email_1 index removed successfully");
    } else {
      console.log("ℹ️ email_1 index not found");
    }

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixIndex();
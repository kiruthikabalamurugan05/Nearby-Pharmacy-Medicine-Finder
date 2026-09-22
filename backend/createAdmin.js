const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./Models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Check if Admin already exists
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);

      await mongoose.connection.close();
      return;
    }

    // Hash Admin password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    // Create Admin
    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      phone: "0000000000",
      password: hashedPassword,
      role: "admin",
      status: "approved",
      location: ""
    });

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Status:", admin.status);
    console.log("================================");

    await mongoose.connection.close();

  } catch (error) {
    console.error("Error creating admin:", error.message);

    await mongoose.connection.close();
  }
};

createAdmin();
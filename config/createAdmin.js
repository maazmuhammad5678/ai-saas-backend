const User = require("../models/User");
const bcrypt = require("bcrypt");

async function createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    const existingAdmin = await User.findOne({
        email: email.toLowerCase()
    });

    if (existingAdmin) {
        existingAdmin.role = "admin";
        existingAdmin.isBlocked = false;
        await existingAdmin.save();

        console.log("Admin account updated");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        name: "System Admin",
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "admin"
    });

    console.log("Admin account created");
}

module.exports = createAdmin;
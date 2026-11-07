const User = require("../models/User");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGNUP
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Assign Free Plan automatically
        const freePlan = await Plan.findOne({
            name: "Free"
        });

        if (freePlan) {
            await Subscription.create({
                user: user._id,
                plan: freePlan._id,
                status: "active",
                endDate: null
            });
        }

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: (email || "").toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked"
            });
        }

        const isMatch = await bcrypt.compare(
            password || "",
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// LOGOUT
function logout(req, res) {
    return res.status(200).json({
        message: "Logout successful. Remove your token from the client."
    });
}

// PROFILE
async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const subscription = await Subscription.findOne({
            user: user._id,
            status: "active"
        }).populate("plan");

        return res.status(200).json({
            user,
            subscription
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    signup,
    login,
    logout,
    getProfile
};
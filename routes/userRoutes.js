const express = require("express");

const router = express.Router();

const {
    signup,
    login,
    logout,
    getProfile
} = require("../controllers/userController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", checkAuthentication, logout);

router.get("/profile", checkAuthentication, getProfile);

module.exports = router;
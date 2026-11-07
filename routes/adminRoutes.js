const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllTools,
    addTool,
    updateTool,
    deleteTool,
    getAnalytics,
    getAllSubscriptions
} = require("../controllers/adminController");

const {
    checkAuthentication,
    restrictTo
} = require("../middlewares/authMiddleware");

router.use(checkAuthentication);
router.use(restrictTo("admin"));

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);
router.delete("/users/:id", deleteUser);

// AI Tools
router.get("/tools", getAllTools);
router.post("/tools", addTool);
router.put("/tools/:id", updateTool);
router.delete("/tools/:id", deleteTool);

// Analytics
router.get("/analytics", getAnalytics);

// Subscriptions
router.get("/subscriptions", getAllSubscriptions);

module.exports = router;
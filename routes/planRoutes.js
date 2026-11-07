const express = require("express");

const router = express.Router();

const {
    getPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
} = require("../controllers/planController");

const {
    checkAuthentication,
    restrictTo
} = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getPlans);
router.get("/:id", getPlanById);

// Admin routes
router.post("/", checkAuthentication, restrictTo("admin"), createPlan);

router.put("/:id", checkAuthentication, restrictTo("admin"), updatePlan);

router.delete("/:id", checkAuthentication, restrictTo("admin"), deletePlan);

module.exports = router;
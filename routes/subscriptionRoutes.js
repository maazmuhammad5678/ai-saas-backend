const express = require("express");

const router = express.Router();

const {
    getCurrentSubscription,
    changeSubscription,
    cancelSubscription
} = require("../controllers/subscriptionController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

router.use(checkAuthentication);

router.get("/", getCurrentSubscription);

router.post("/change", changeSubscription);

router.post("/cancel", cancelSubscription);

module.exports = router;
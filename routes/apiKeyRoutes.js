const express = require("express");

const router = express.Router();

const {
    generateAPIKey,
    regenerateAPIKey,
    deleteAPIKey,
    getAPIKeys,
    getAPIUsage
} = require("../controllers/apiKeyController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

router.use(checkAuthentication);

router.post("/generate", generateAPIKey);

router.post("/regenerate", regenerateAPIKey);

router.get("/", getAPIKeys);

router.delete("/:id", deleteAPIKey);

router.get("/usage", getAPIUsage);

module.exports = router;
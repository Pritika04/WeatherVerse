const express = require("express");
const authMiddleware = require("../authMiddleware");

const router = express.Router();

router.get("/free-endpoint", (req, res) => {
  res.json({ message: "You are free to access me anytime" });
});

router.get("/auth-endpoint", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized to access me"
  });
});

module.exports = router;
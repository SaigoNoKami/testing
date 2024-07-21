const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyAccessToken = require("./middlewares/protected");

router.get("/all", verifyAccessToken, userController.getAllUsers);

module.exports = router;

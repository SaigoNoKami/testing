const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.get("/all", async (req, res) => {
  try {
    const users = await userService.getAll();
    const usersWithoutHashedPassword = users.map(({ hashedPassword, ...rest }) => rest);
    res.status(200).json(usersWithoutHashedPassword);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send(`Error fetching users: ${error.message}`);
  }
});

module.exports = router;

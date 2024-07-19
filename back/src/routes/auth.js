const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");

const authService = new AuthService();
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userID = await authService.register(username, password);
    if (userID) {
      return res.status(200).send(`User added with ID: ${userID}`);
    } else {
      return res
        .status(400)
        .send(`User with this name already exists: ${username}`);
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).send(`Error adding user: ${error.message}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken, id } = await authService.login(
      username,
      password,
    );
    if (accessToken && refreshToken) {
      res.cookie("oldRefreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res
        .status(200)
        .json({ accessToken, refreshToken, user: { id, username } });
    }
    return res.status(401).send("Invalid username or password");
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).send(`Error logging in: ${error.message}`);
  }
});

router.get("/refresh", async (req, res) => {
  try {
    const { oldRefreshToken } = req.cookies;
    if (!oldRefreshToken) {
      return res.status(401).send("Refresh token not provided");
    }
    const { accessToken, refreshToken, user } =
      await authService.refreshTokens(oldRefreshToken);
    if (!accessToken || !refreshToken) {
      return res.status(401).send("Invalid refresh token");
    }
    res.cookie("oldRefreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).send(`Error logging in: ${error.message}`);
  }
});

module.exports = router;

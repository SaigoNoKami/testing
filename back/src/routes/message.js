const express = require("express");
const router = express.Router();
const verifyAccessToken = require("./middlewares/protected");
const messageController = require("../controllers/messageController");

module.exports = (io) => {
  router.post("/send", verifyAccessToken, messageController.sendMessage(io));
  router.get("/chat", verifyAccessToken, messageController.getChat);
  router.delete("/delete/:messageID", verifyAccessToken, messageController.deleteMessage(io));
  router.patch("/update/:messageID", verifyAccessToken, messageController.updateMessage(io));

  return router;
};

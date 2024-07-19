const express = require("express");
const router = express.Router();
const fileService = require("../services/fileService");
const MessageService = require("../services/messageService");
const busboy = require("busboy");
const verifyAccessToken = require("./middlewares/protected");
const userService = require("../services/userService");

const messageService = new MessageService();

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ userId }) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {});
  });

  router.post("/send", verifyAccessToken, (req, res) => {
    const bb = busboy({ headers: req.headers });
    const fields = {};
    const filesURL = [];
    const filePromises = [];
    const fieldPromises = [];

    bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filePromise = fileService
        .createFile(filename.filename, file)
        .then((fileName) => {
          filesURL.push(fileName);
        })
        .catch((err) => {
          console.error(`File upload error [${fieldname}]: ${err.message}`);
        });

      filePromises.push(filePromise);
    });

    bb.on("field", (fieldname, val) => {
      if (fieldname === "toUserID" || fieldname === "fromUserID") {
        const fieldPromise = userService
          .getOneExists(val)
          .then((exist) => {
            if (exist) {
              fields[fieldname] = val;
            } else {
              throw new Error(`User does not exist: ${val}`);
            }
          })
          .catch((err) => {
            console.error(`User validation error: ${err.message}`);
            throw err;
          });

        fieldPromises.push(fieldPromise);
      } else {
        fields[fieldname] = val;
      }
    });

    bb.on("finish", async () => {
      try {
        await Promise.all(filePromises);
        await Promise.all(fieldPromises);
        const time = new Date().toISOString();
        const message = {
          fromUserID: fields.fromUserID,
          toUserID: fields.toUserID,
          message: fields.message,
          filesURL,
          time,
        };
        message.id = await messageService.saveMessage(message);

        io.to(fields.fromUserID).emit("newMessage", message);
        io.to(fields.toUserID).emit("newMessage", message);

        res.status(200).json(message);
      } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).send(`Error saving data: ${err.message}`);
      }
    });

    req.pipe(bb);
  });

  router.get("/chat", async (req, res) => {
    try {
      const { user1, user2 } = req.query;
      const chat = await messageService.getChatMessages(user1, user2);
      res.status(200).json(chat);
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).send(`Error fetching chat: ${error.message}`);
    }
  });

  router.delete("/delete/:messageID", async (req, res) => {
    try {
      const { messageID } = req.params;
      const message = await messageService.deleteMessage(messageID);
      io.to(message.fromUserID).emit("deleteMessage", messageID);
      io.to(message.toUserID).emit("deleteMessage", messageID);

      res.status(200).send();
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).send(`Error deleting message: ${error.message}`);
    }
  });

  router.patch("/update/:messageID", async (req, res) => {
    try {
      const { messageID } = req.params;
      const message = req.body;
      const updatedMessage = await messageService.updateMessage(
        messageID,
        message
      );
      io.to(updatedMessage.fromUserID).emit("updateMessage", updatedMessage);
      io.to(updatedMessage.toUserID).emit("updateMessage", updatedMessage);

      res.status(200).json(updatedMessage);
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).send(`Error updating message: ${error.message}`);
    }
  });

  return router;
};

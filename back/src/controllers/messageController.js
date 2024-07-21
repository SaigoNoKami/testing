const busboy = require("busboy");
const MessageService = require("../services/messageService");
const BbService = require("../services/bbService");

const messageService = new MessageService();
const bbService = new BbService();

exports.sendMessage = (io) => (req, res) => {
  try {
    const bb = busboy({ headers: req.headers });

    bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
      bbService.handleFiles(fieldname, file, filename, encoding, mimetype);
    });

    bb.on("field", (fieldname, val) => {
      bbService.handleFields(fieldname, val);
    });

    bb.on("finish", async () => {
      const message = await bbService.handlefinish(io);
      bbService.setStart();
      res.status(200).json(message);
    });

    req.pipe(bb);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send(`Error sending message: ${error.message}`);
  }
};

exports.getChat = async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    const chat = await messageService.getChatMessages(user1, user2);
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).send(`Error fetching chat: ${error.message}`);
  }
};

exports.deleteMessage = (io) => async (req, res) => {
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
};

exports.updateMessage = (io) => async (req, res) => {
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
};

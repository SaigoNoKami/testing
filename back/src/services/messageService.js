const { messageRef } = require("../db");
const fileService = require("../services/fileService");

class MessageService {
  async saveMessage({ fromUserID, toUserID, message, filesURL, time }) {
    try {
      const newMessageRef = messageRef.push();
      await newMessageRef.set({
        fromUserID,
        toUserID,
        message,
        filesURL,
        time,
      });
      return newMessageRef.key;
    } catch (err) {
      throw new Error("Error saving message: " + err.message);
    }
  }

  async getChatMessages(user1, user2) {
    try {
      const snapshot1 = await messageRef
        .orderByChild("fromUserID")
        .equalTo(user1)
        .once("value");

      const snapshot2 = await messageRef
        .orderByChild("fromUserID")
        .equalTo(user2)
        .once("value");

      const messages = [];

      snapshot1.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.toUserID === user2) {
          messages.push({ id: childSnapshot.key, ...message });
        }
      });

      snapshot2.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.toUserID === user1) {
          messages.push({ id: childSnapshot.key, ...message });
        }
      });
      messages.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

      return messages;
    } catch (err) {
      throw new Error("Error fetching messages: " + err.message);
    }
  }

  async updateMessage(messageID, updatedField) {
    try {
      const messageSnapshot = await messageRef.child(messageID).once("value");
      if (!messageSnapshot.exists()) {
        throw new Error("Message not found");
      }

      await messageRef.child(messageID).update(updatedField);

      const updatedMessageSnapshot = await messageRef
        .child(messageID)
        .once("value");
      const updatedMessage = updatedMessageSnapshot.val();

      return { id: messageID, ...updatedMessage };
    } catch (err) {
      throw new Error("Error updating message: " + err.message);
    }
  }

  async deleteMessage(messageID) {
    try {
      const messageSnapshot = await messageRef.child(messageID).once("value");
      if (!messageSnapshot.exists()) {
        throw new Error("Message not found");
      }
      const message = messageSnapshot.val();
      const { filesURL } = message;

      if (filesURL && filesURL.length > 0) {
        for (const url of filesURL) {
          const matches = url.match(
            /storage\.googleapis\.com\/[^\/]+\/([^?]+)/
          );
          if (matches && matches[1]) {
            await fileService.deleteFile(decodeURIComponent(matches[1]));
          }
        }
      }
      await messageRef.child(messageID).remove();
      return messageSnapshot.val();
    } catch (err) {
      throw new Error("Error deleting message: " + err.message);
    }
  }
}

module.exports = MessageService;

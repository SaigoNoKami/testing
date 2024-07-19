const stream = require("stream");
const uuid = require("uuid");
require("dotenv").config();
const { bucket } = require("../db");

class FileService {
  async createFile(filename, fileStream) {
    try {
      const file = bucket.file(filename);
      await new Promise((resolve, reject) => {
        fileStream
          .pipe(file.createWriteStream())
          .on("error", (err) => {
            console.error("File upload error:", err);
            reject(err);
          })
          .on("finish", resolve);
      });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      console.log("File successfully uploaded");
      return url;
    } catch (err) {
      throw new Error("Error uploading file: " + err.message);
    }
  }

  async deleteFile(filename) {
    try {
      const file = bucket.file(filename);

      await file.delete();
      console.log("File successfully deleted");
    } catch (err) {
      console.error("File deletion error:", err);
      throw new Error("Error deleting file: " + err.message);
    }
  }
}

const fileService = new FileService();
module.exports = fileService;

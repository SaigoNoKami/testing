const fileService = require("../services/fileService");
const MessageService = require("../services/messageService");
const userService = require("../services/userService");

const messageService = new MessageService();

class BbService {
    constructor() {
        this.fields = {};
        this.filesURL = [];
        this.filePromises = [];
        this.fieldPromises = [];
      }
    

   async handleFiles(fieldname, file, filename, encoding, mimetype){
        const filePromise = fileService
          .createFile(filename.filename, file)
          .then((fileName) => {
            this.filesURL.push(fileName);
          })
          .catch((err) => {
            console.error(`File upload error [${fieldname}]: ${err.message}`);
          });
  
        this.filePromises.push(filePromise);
      }

      async handleFields(fieldname, val){
        if (fieldname === "toUserID" || fieldname === "fromUserID") {
          const fieldPromise = userService
            .getOneExists(val)
            .then((exist) => {
              if (exist) {
                this.fields[fieldname] = val;
              } else {
                throw new Error(`User does not exist: ${val}`);
              }
            })
            .catch((err) => {
              console.error(`User validation error: ${err.message}`);
              throw err;
            });
  
          this.fieldPromises.push(fieldPromise);
        } else {
          this.fields[fieldname] = val;
        }
      }

      async handlefinish(io){
        try {
          await Promise.all(this.filePromises);
          await Promise.all(this.fieldPromises);
          const time = new Date().toISOString();
          const message = {
            fromUserID: this.fields.fromUserID,
            toUserID: this.fields.toUserID,
            message: this.fields.message,
            filesURL: this.filesURL,
            time,
          };
          message.id = await messageService.saveMessage(message);
          io.to(this.fields.fromUserID).emit("newMessage", message);
          io.to(this.fields.toUserID).emit("newMessage", message);
          return message
        } catch (err) {
          console.error("Error saving data:", err);
        }
      }

      setStart(){
        this.fields = {};
        this.filesURL = [];
        this.filePromises = [];
        this.fieldPromises = [];
      }
}

module.exports = BbService
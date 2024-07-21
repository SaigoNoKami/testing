const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const dotenv = require("dotenv");
dotenv.config();
const serviceAccount = require("../../cred.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL, 
  storageBucket:process.env.STORAGE_BUCKET,
});

const db = admin.database();
const userRef = db.ref("Users");
const messageRef = db.ref("Messages");
const refreshTokenRef = db.ref("RefreshToken");
const bucket = getStorage().bucket();

module.exports = { userRef, messageRef, refreshTokenRef, bucket };

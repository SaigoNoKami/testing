const { userRef } = require("../db");

class UserService {
  async getAll() {
    try {
      const snapshot = await userRef.once("value");
      const users = snapshot.val();
      return users
        ? Object.keys(users).map((key) => ({ id: key, ...users[key] }))
        : [];
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }

  async getOneExists(userID) {
    try {
      const snapshot = await userRef.child(userID).once("value");
      return snapshot.exists();
    } catch (err) {
      console.error("Error checking if user exists:", err);
      throw new Error("Error checking if user exists");
    }
  }

  async getUserById(userId) {
    try {
      const snapshot = await userRef.child(userId).once("value");
      if (!snapshot.exists()) {
        throw new Error("User not found");
      }
      return { id: userId, ...snapshot.val() };
    } catch (err) {
      throw new Error("Error fetching user: " + err.message);
    }
  }
}

module.exports = new UserService();

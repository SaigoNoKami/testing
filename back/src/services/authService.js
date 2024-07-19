const jwt = require("jsonwebtoken");
const { CryptoService } = require("../services/cryptoService");
const { userRef, refreshTokenRef } = require("../db");

class AuthService {
  constructor() {
    this.cryptoService = new CryptoService();
  }

  async register(username, password) {
    try {
      const snapshot = await userRef
        .orderByChild("username")
        .equalTo(username)
        .once("value");
      if (snapshot.exists()) {
        return false;
      }
      const hashedPassword = this.cryptoService.hash(password);
      const newUserRef = userRef.push();
      await newUserRef.set({ username, hashedPassword });
      return newUserRef.key;
    } catch (error) {
      throw new Error("Failed to register user: " + error.message);
    }
  }

  async login(username, password) {
    try {
      const snapshot = await userRef
        .orderByChild("username")
        .equalTo(username)
        .once("value");
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const id = Object.keys(userData)[0];
        const user = userData[id];
        if (this.cryptoService.compare(password, user.hashedPassword)) {
          const { accessToken, refreshToken } = await this.getTokens(
            id,
            user.username,
          );
          await this.saveRefreshToken(id, refreshToken);
          return { accessToken, refreshToken, id };
        }
      }
      return false;
    } catch (error) {
      throw new Error("Failed to login user: " + error.message);
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    try {
      await refreshTokenRef.child(userId).remove();
      await refreshTokenRef.child(userId).set({ refreshToken });
    } catch (error) {
      throw new Error("Failed to save refresh token: " + error.message);
    }
  }

  async getTokens(userId, username) {
    try {
      const accessToken = jwt.sign(
        { id: userId, username },
        process.env.JWT_SECRET,
        { expiresIn: "1m" },
      );
      const refreshToken = jwt.sign(
        { id: userId, username },
        process.env.REFRESH_TOKEN_SECRET,
      );
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error("Failed to generate tokens: " + error.message);
    }
  }

  async refreshTokens(OldRefreshToken) {
    try {
      const decoded = jwt.verify(
        OldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const snapshot = await refreshTokenRef.child(decoded.id).once("value");
      const storedRefreshToken = snapshot.exists()
        ? snapshot.val().refreshToken
        : null;
      if (OldRefreshToken !== storedRefreshToken) {
        throw new Error("Invalid refresh token");
      }

      const { accessToken, refreshToken } = await this.getTokens(
        decoded.id,
        decoded.username,
      );
      await this.saveRefreshToken(decoded.id, refreshToken);

      const user = (await userRef.child(decoded.id).once("value")).val();
      return {
        accessToken,
        refreshToken,
        user: { id: decoded.id, username: user.username },
      };
    } catch (error) {
      throw new Error("Failed to refresh tokens: " + error.message);
    }
  }
}

module.exports = AuthService;

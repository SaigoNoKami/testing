const crypto = require("crypto");

class CryptoService {
  hash(password) {
    const salt = crypto.randomBytes(128).toString("base64");
    const hash = crypto.createHash("sha512").update(password).digest("hex");
    return hash + salt;
  }

  compare(password, hash) {
    const pass_hash1 = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
    let pass_hash2 = hash.slice(0, -172);
    return pass_hash1 === pass_hash2;
  }
}

module.exports = { CryptoService };

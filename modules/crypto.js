const crypto = require('crypto');

let cryptoPass = (password, salt) => {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

module.exports = cryptoPass;

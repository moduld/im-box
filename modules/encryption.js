const jwt = require('jsonwebtoken');
const config = require('../configs/config');

let decoding = function (token) {
  return jwt.verify(token, config.secret, (error, decoded) => {
      if (error) {
        return {success: false};
      } else {
        return {success: true, decoded: decoded};
      }
    });
};

let encription = function (encriptData) {
  return jwt.sign(encriptData.idObject, encriptData.secret);
};

module.exports = {
  decoding: decoding,
  encription: encription
};

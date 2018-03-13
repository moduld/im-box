const encription = require('./encryption');
const crypto = require('./crypto');
const uuid = require('uuid');

module.exports = {
  makeRegistrationUser,
  makeUserUpdateData
};

function makeRegistrationUser (data) {
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.email = data.email;
  this.secret = uuid();
  this.password = crypto(data.password, this.secret);
  this.expired = new Date().getTime() + 2592000000;
  this.created = new Date().getTime();
  this.token = encription
    .encription({
      idObject: {"email": data.email},
      secret: this.secret
    });
  return this
}

function makeUserUpdateData(email) {
  this.secret = uuid();
  this.expired = new Date().getTime() + 2592000000;
  this.token = encription
    .encription({
      idObject: {"email": email},
      secret: this.secret
    });
  return this
}

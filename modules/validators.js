module.exports = {
  validateRegistrationData,
  validateLoginData
};

function validateRegistrationData(data) {
  let formPatterns = {
    firstName: /^[a-zA-Z]+$/,
    lastName: /^[a-zA-Z]+$/,
    email: /[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
    password: /.{6,}/
  };
  return check(formPatterns, data);
}

function validateLoginData(data) {
  let formPatterns = {
    email: /[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
    password: /.{6,}/
  };
  return check(formPatterns, data);
}

function check(patterns, data) {
  for (let key in patterns) {
    if (patterns.hasOwnProperty(key) && data[key]) {
      if (!patterns[key].test(data[key])) {
        return {success: false, message: `${key} is invalid`};
      }
    } else {
      return {success: false, message: `${key} is required`};
    }
  }
  return {success: true};
}

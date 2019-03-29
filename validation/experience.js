const isEmpty = require("./is-empty");
const validator = require("validator");

module.exports = function validateExperienceInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Campo emprego não pode estar em branco";
  }

  if (validator.isEmpty(data.company)) {
    errors.company = "Campo empresa não pode estar em branco";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "Campo desde não pode estar em branco";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

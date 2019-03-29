const isEmpty = require("./is-empty");
const validator = require("validator");

module.exports = function validateEducationInput(data) {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "Campo escola não pode estar em branco";
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "Campo grau de educação não pode estar em branco";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "Campo desde não pode estar em branco";
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Campo campo de estudo não pode estar em branco";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

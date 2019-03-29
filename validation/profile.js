const isEmpty = require("./is-empty");
const validator = require("validator");

module.exports = function validateProfileInput(data) {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle precisa ter entre 2 e 4 caracteres";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Perfil handle é obrigatório";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Campo status é obrigatório";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "Campo skills é obrigatório";
  }
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "URL invalida";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "URL invalida";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "URL invalida";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "URL invalida";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "URL invalida";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "URL invalida";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

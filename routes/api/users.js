const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../.././config/keys");
const passport = require("passport");

//load input validation

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//load User Model

const User = require("../../models/User");
//@Route    GET /api/users/teste
//@desc     Test Users route
//@access   Public

router.get("/teste", (req, res) =>
  res.json({ msg: "Funcionou a rota USERS !!" })
);

//@Route    GET /api/users/register
//@desc     Register user
//@access   Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Este email já existe !" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //tamanho da imagem
        r: "pg", //rating
        default: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@Route    GET /api/users/login
//@desc     Login / Return JWD token
//@access   Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //find user by email

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "Usuário não cadastrado";
      return res.status(404).json({ errors });
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        //create JWT payload

        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign the token

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Senha incorreta";
        return res.status(400).json({ errors });
      }
    });
  });
});

//@Route    GET /api/users/current
//@desc     Return current user
//@access   Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    });
  }
);

module.exports = router;

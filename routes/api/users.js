const express = require("express");
const router = express.Router();

//@Route    GET /api/users/teste
//@desc     Test Users route
//@access   Public

router.get("/teste", (req, res) =>
  res.json({ msg: "Funcionou a rota USERS !!" })
);

module.exports = router;

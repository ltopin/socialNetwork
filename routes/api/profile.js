const express = require("express");
const router = express.Router();

//@Route    GET /api/profile/teste
//@desc     Test Profile route
//@access   Public
router.get("/teste", (req, res) =>
  res.json({ msg: "Funcionou a rota Profile  !!" })
);

module.exports = router;

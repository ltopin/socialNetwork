const express = require("express");
const router = express.Router();

//@Route    GET /api/posts/teste
//@desc     Test Posts route
//@access   Public

router.get("/teste", (req, res) =>
  res.json({ msg: "Funcionou a rota Posts !!" })
);

module.exports = router;

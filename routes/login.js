const express = require("express");
const { findOne } = require("../models/User");
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ msg: "invalid credentails" });

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ msg: "invalid credentails" });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "2h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.json({ msg: "error in login" });
    console.log(err);
  }
});

module.exports = router;

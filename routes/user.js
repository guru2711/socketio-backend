const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { findOne } = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  //   user input is empty
  try {
    //   checking whether user already exist
    let existUser = await UserModel.findOne({ email });
    if (existUser) return res.status(404).json({ msg: "user already exists" });

    // intiating
    register = new UserModel({
      username,
      email,
      password,
    });

    // hashing
    const Salt = await bcrypt.genSalt(10);
    register.password = await bcrypt.hash(password, Salt);

    // save in db
    await register.save();

    // payload
    const payload = {
      register: {
        id: register.id,
      },
    };

    //  jwt sign
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.json({ message: "Error in registration" });
    console.log("error in register", err);
  }
});

module.exports = router;

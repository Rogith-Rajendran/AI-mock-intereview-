const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();


// ========================================
// SIGNUP
// ========================================

router.post("/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    // Check required fields

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name, email and password are required."

      });

    }


    const cleanEmail =
      email.trim().toLowerCase();


    // Check existing user

    const existingUser =
      await User.findOne({
        email: cleanEmail
      });


    if (existingUser) {

      return res.status(409).json({

        success: false,

        message:
          "An account with this email already exists."

      });

    }


    // Create user

    const user =
      await User.create({

        name: name.trim(),

        email: cleanEmail,

        password: password

      });


    return res.status(201).json({

      success: true,

      message:
        "User registered successfully",

      user: {

        id: user._id,

        name: user.name,

        email: user.email

      }

    });

  }

  catch (error) {

    console.error(
      "Signup error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to register user."

    });

  }

});


// ========================================
// LOGIN
// ========================================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    // Check required fields

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required."

      });

    }


    const cleanEmail =
      email.trim().toLowerCase();


    // Find user

    const user =
      await User.findOne({
        email: cleanEmail
      });


    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password."

      });

    }


    // Compare password

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password."

      });

    }


    // Login successful

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      user: {

        id: user._id,

        name: user.name,

        email: user.email

      }

    });

  }

  catch (error) {

    console.error(
      "Login error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to login."

    });

  }

});


module.exports = router;
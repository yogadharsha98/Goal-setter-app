const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add name,email,password');
  }

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const asyncHandler = require("express-async-handler");
// const User = require("../models/userModel");

// //register user
// // @route POST/api/users
// //@access Public

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     res.status(400);
//     throw new Error("Please add all fields");
//   }
//   //Check if user exists
//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User alreadym exists ");
//   }

//   //Hash pswd

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });

//   if (user) {
//     res.status(201).json({
//       _id: user.id,
//       name: user.name,
//       email: user.email,
//       token:generateToken(user._id)
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// //register Authenticate a user
// // @route POST/api/users/login
// //@access Public

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   //check for the user email
//   const user = await User.findOne({ email });

//   if (user && (await bcrypt.compare(password, user.password))) {
//     res.json({
//       _id: user.id,
//       name: user.name,
//       email: user.email,
//       token:generateToken(user._id)
//     });
//   } else{
//     res.status(400)
//     throw new Error('Invalid credentials')
//   }
// });

// //register user
// // @route POST/api/users
// //@access Private

// const getMe = asyncHandler(async (req, res) => {

//   res.status(200).json(req.user)
// });

// //Generate JWT

// const generateToken = (id) =>{
//     return jwt.sign({id},process.env.JWT_SECRET,{
//         expiresIn:'30d',
//     })
// }

// module.exports = {
//   registerUser,
//   loginUser,
//   getMe,
// };

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const app =express()


const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.body);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send({
        "Msg":"User Not Found"
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const createUser = asyncHandler(async(req,res)=>{
    try {
        const user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 8);
        data = await user.save();
        res.status(201).send({
            "status":"User is Created",
            "data":data
        });
    } catch (error) {
        if (error?.code == 11000) {
            res.status(400).json({
                "Error": "User already exist "+req?.body?.email
            })
        }
        else {
            res.status(404).json({
                "Error": error
            })
        }
    }
})

const login = asyncHandler(async(req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send({ error: 'Invalid login credentials' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.send({ user, token });
})
module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  login
};

const asyncHandler = require("express-async-handler");

const Goal = require("../models/goalModel");
const User = require("../models/userModel");


//Get Goals
// @route GET/api/goals
//@access Private

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({user:req.user.id});

  res.status(200).json(goals);
});

//Set Goals
// @route POST/api/goals
//@access Private

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a textfield");
  }
  const goal = await Goal.create({
    text: req.body.text,
    user:req.user.id
  });
  res.status(200).json(goal);
});

//PUT Goals
// @route PUT/api/goals/:id
//@access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  

//check for user
  if(!req.user){
    res.status(401)
    throw new Error('User Not Found')
  }
  //make sure the logged in user matches the goal user
  if(goal.user.toString()!== req.user.id){
    res.status(401)
    throw new Error('User not authorized')
  }

  const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updateGoal);
});

//DELETE Goals
// @route DELETE/api/goals/:id
//@access Private

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  if(goal.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('User not authorized!')
  }

  await goal.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};

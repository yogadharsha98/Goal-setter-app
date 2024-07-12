const express = require('express');
const {
  getGoals,
  setGoals,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getGoals).post(protect, setGoals);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);

module.exports = router;

// const express= require('express')
// const router = express.Router()
// const {getGoals, setGoal, updateGoal, deleteGoal} = require('../controllers/goalController')
// const {protect}=require('../middleware/authMiddleware')

// router.route('/').get(protect,getGoals).post(protect,setGoal)

// router.route('/:id').delete(protect,deleteGoal).put(protect,updateGoal)

// module.exports = router

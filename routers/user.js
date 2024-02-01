const express = require('express');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/user');
const { isAdmin } = require('../middlewares/authentication');

const router = express.Router();

router.get('/', isAdmin, getAllUsers);
router.get('/showMe', showCurrentUser);
router.patch('/updateUser', updateUser);
router.patch('/updateUserPassword', updateUserPassword);
router.get('/:id', getSingleUser);

module.exports = router;

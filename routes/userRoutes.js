const express = require('express');

const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router
  .route('/')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    userControllers.getAllUsers,
  )
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    userControllers.createUser,
  );

router
  .route('/:id')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    userControllers.getUser,
  )
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    userControllers.updateUser,
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    userControllers.deleteUser,
  );

module.exports = router;

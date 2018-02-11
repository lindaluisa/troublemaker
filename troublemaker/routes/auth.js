const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

/* GET users listing. */
// sign-up route
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    const message = 'Both fields are required';
    return res.render('signup', {message});
  }
  const newUser = new User({
    username: username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('revolutions');
    }
  });
});

module.exports = router;

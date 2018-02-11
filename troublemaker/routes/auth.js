const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

/* GET signup */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

/* POST signup */
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    const message = 'Both fields are required';
    return res.render('signup', {message});
  }

  let dbPromise = User.findOne({'username': username}, 'username');
  dbPromise.then((result) => {
    if (result !== null) {
      const message = 'This comrade already exists';
      return res.render('signup', {message});
    } else {
      createNewUser(username, password);
    }
  }).catch((err) => {
    throw new Error(err);
  });

  const createNewUser = (username, password) => {
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
  };
});

/* GET login */
router.get('/login', (req, res, next) => {
  res.render('login');
});

/* POST login */
router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    const message = 'Both fields are required';
    return res.render('login', {message});
  }

  let loginPromise = User.findOne({'username': username});
  loginPromise.then((result) => {
    checkUser(username, password, result);
  }).catch((err) => {
    throw new Error(err);
  });

  const checkUser = (username, password, user) => {
    if (!user) {
      const message = 'This comrade does not exist.';
      return res.render('login', {message});
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      return res.redirect('/revolutions');
    } else {
      const message = 'Incorrect Security Password';
      return res.render('login', {message});
    }
  };
});

/* POST logout */
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;

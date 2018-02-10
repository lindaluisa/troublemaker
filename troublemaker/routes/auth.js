var express = require('express');
var router = express.Router();

/* GET users listing. */
// sign-up route
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log(res.locals.user);
  res.render('index');
});

module.exports = router;

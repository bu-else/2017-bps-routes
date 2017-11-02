var express = require('express');
var router = express.Router();

/* GET submission listing. */
router.get('/', function(req, res, next) {
  res.render('submit');
});


module.exports = router;

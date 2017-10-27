var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("Nothing to see here");
});

router.get('/:username', function(req, res, next) {
  let username = req.params.username;
  let title = `${ username }'s Profile`;
  res.render('profile', { title: title, username: username });
});

module.exports = router;

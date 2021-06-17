var express = require('express');
var router = express.Router();

// Index Page
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

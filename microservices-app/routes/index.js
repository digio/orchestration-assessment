var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blah Blah Bank' });
});

module.exports = router;

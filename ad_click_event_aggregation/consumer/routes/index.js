var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Consumer',
    start: '/consumers?action=start',
    stop: '/consumers?action=stop',
  });
});

module.exports = router;

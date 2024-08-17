var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Producer',
    start: '/produers?action=start&count=10',
    stop: '/produers?action=stop',
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
    res.render('student/login')
})



module.exports = router;
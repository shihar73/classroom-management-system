var express = require('express');
var router = express.Router();
var studentHelper = require('../helpers/student-helper')

const verifyLogin = (req, res, next) => {
    console.log(req.session.studentLoggedIn);
    if (req.session.studentLoggedIn) next()
    else res.redirect("/login")
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/home',verifyLogin,(req,res)=>{
    res.render('student/student-home')
})

router.get('/login', (req, res) => {
    if (req.session.studentLoggedIn) {
        res.redirect('/home')
    } else {
        res.render('student/login', { "loginErr": req.session.studentloginErr })
        req.session.studentloginErr = false
    }
})
router.post('/login',(req,res)=>{
    studentHelper.doLogin(req.body).then((response)=>{
        if (response.logStatus) {
            console.log(response);
            req.session.studentLoggedIn = true
            req.session.student = response.student
            res.redirect('/home')
        } else {
            req.session.studentloginErr = response.loginErr
            res.redirect("/login")
        }
    })
})

router.get('/logout',(req,res)=>{
    req.session.studentLoggedIn = false
    req.session.student = null
    res.redirect('/')
})   


module.exports = router;
var express = require('express');
var router = express.Router();
var studentHelper = require('../helpers/student-helper')

const verifyLogin = (req, res, next) => {
    if (req.session.studentLoggedIn) next()
    else res.redirect("/login")
}

studentData={}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/home',verifyLogin,(req,res)=>{
    studentData.login=req.session.studentLoggedIn
    res.render('student/student-home',{studentData})
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
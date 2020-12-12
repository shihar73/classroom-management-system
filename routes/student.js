var express = require('express');
var router = express.Router();
var studentHelper = require('../helpers/student-helper')

const verifyLogin = (req, res, next) => {
    if (req.session.studentLoggedIn) next()
    else res.redirect("/login")
}

const studentVerify = (req, res, next) => {
    if (req.session.student) next()
    else res.redirect("/login")
}


studentData = {}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/home', verifyLogin, (req, res) => {
    studentData.login = req.session.studentLoggedIn
    console.log(studentData);
    res.render('student/student-home', { studentData })
})

router.get('/login', (req, res) => {
    if (req.session.studentLoggedIn) {
        res.redirect('/home')
    } else {
        res.render('student/login', { "loginErr": req.session.studentloginErr })
        req.session.studentloginErr = false
    }
})
router.post('/login', (req, res) => {
    studentHelper.doLogin(req.body).then((response) => {
        if (response.logStatus) {
            req.session.student = response.student
            studentData.student = response.student
            res.redirect('/otp')
        } else {
            req.session.studentloginErr = response.loginErr
            res.redirect("/login")
        }
    })
})
router.get('/otp', studentVerify, (req, res) => {
    console.log(req.session.student);
    studentHelper.sendOtp(req.session.student.number).then((otp) => {
        console.log(otp, 'asdvsdfvsavddsfvsdfvfsgv');
        studentData.otp = otp
    })
    // studentData.otp = Math.random();
    // studentData.otp  = studentData.otp  * 10000;
    // studentData.otp  = parseInt(studentData.otp );
    // console.log(studentData.otp );
    res.render('student/otp', { msg })
    var msg = null
})
router.post("/otp", (req, res) => {
    console.log(req.body);
    studentHelper.verifyOtp(studentData.otp, req.body.otp).then((response) => {

        if (response) {
            req.session.studentLoggedIn = true
            res.redirect('/home')

        } else {
            req.session.studentLoggedIn = false
            req.session.student = null
            req.session.studentloginErr = "Otp is not match please login again"
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.studentLoggedIn = false
    req.session.student = null
    res.redirect('/')
})

router.get("/assignments", verifyLogin, (req, res) => {
    console.log("dfasdfadsafsaSDFERHGTEGVFSDGBBFHF");
    studentHelper.getAssignment().then((data) => {

        res.render('student/assignment', { data, studentData })
    })
})


module.exports = router;
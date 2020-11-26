const { response } = require('express');
var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helper')

const verifyLogin = (req, res, next) => {
    if (req.session.tutorLoggedIn) next()
    else res.redirect("/login")
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.session.tutorLoggedIn) {
        res.redirect('/tutor/home')
    } else {
        console.log(req.session.tutorloginEr);
        res.render('tutor/tutor-login', { "loginErr": req.session.tutorloginErr })
        req.session.tutorloginErr = false
    }
});
router.get("/home", verifyLogin, (req, res) => {
    res.render("tutor/tutor-home")
})

router.post('/login', (req, res) => {
    tutorHelper.doLogin(req.body).then((response) => {
        if (response.logStatus) {
            console.log(response);
            req.session.tutorLoggedIn = true
            req.session.tutor = response.tutor
            res.redirect('/tutor/home')
        } else {
            console.log(response);
            req.session.tutorloginErr = response.loginErr
            res.redirect("/tutor")
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.tutorLoggedIn = false
    req.session.tutor = null
    res.redirect('/')
})

module.exports = router;
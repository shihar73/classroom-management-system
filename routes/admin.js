var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin-helper')

var adminLoggedIn = false
var adminLoginErr = false

const veifyadminLogin = (req, res, next) => {
    if (adminLoggedIn) next()
    else res.redirect("/admin/login")
}



router.get('/', veifyadminLogin, function(req, res, next) {
    res.render('admin/admin')
});

router.get('/login', function(req, res, ) {
    console.log(req.session);
    res.render('admin/admin-login', { "loginErr": adminLoginErr })
});


router.post('/login', (req, res) => {
    console.log(req.body);
    let email = 'shihar@gimail.com'
    let pass = '123'
    if (req.body.email === email) {
        if (req.body.password === pass) {
            adminLoggedIn = true
            res.redirect('/admin')
        } else {
            adminLoggedIn = false
            adminLoginErr = "Invalid Password"
            res.redirect("/admin/login")
        }
    } else {
        adminLoggedIn = false
        adminLoginErr = "Invalid Email"
        res.redirect("/admin/login")
    }
})

router.get('/add-tutor', veifyadminLogin, (req, res) => {
    res.render('admin/add-tutor')
})

router.post('/add-tutor', (req, res) => {

    adminHelper.addTutor(req.body).then(() => {
        res.redirect("/admin")
    })
})

router.get('/add-student', veifyadminLogin, (req, res) => {
    res.render('admin/add-student')
})

router.post('/add-student', (req, res) => {
    console.log(req.body);
    adminHelper.addStudent(req.body).then(() => {
        res.redirect("/admin")
    })
})

module.exports = router;
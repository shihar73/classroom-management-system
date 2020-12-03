const { response } = require('express');
var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helper')

const verifyLogin = (req, res, next) => {
    if (req.session.tutorLoggedIn) next()
    else res.redirect("/tutor")
}
var tutorData = {}

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
    tutorData.login = req.session.tutorLoggedIn
    res.render("tutor/tutor-home", { tutorData })
})

router.post('/login', (req, res) => {
    tutorHelper.doLogin(req.body).then((response) => {
        if (response.logStatus) {
            req.session.tutorLoggedIn = true
            req.session.tutor = response.tutor
            res.redirect('/tutor/home')
        } else {
            req.session.tutorloginErr = response.loginErr
            res.redirect("/tutor")
        }
    })
})

router.get('/profile', verifyLogin, async (req, res) => {
    tutorData.login = req.session.tutorLoggedIn
    tutorData.tutor = await tutorHelper.getTutorData(req.session.tutor._id)
    res.render('tutor/tutor-profile', { tutorData })
})

router.get("/edit-profile", verifyLogin, async (req, res) => {
    tutorData.login = false
    tutorData.tutor = await tutorHelper.getTutorData(req.session.tutor._id)
    console.log(tutorData);
    res.render('tutor/edit-profile', { tutorData })
})

router.post('/edit-profile', (req, res) => {

    let id = req.session.tutor._id
    tutorHelper.editData(id, req.body).then(() => {
        res.redirect("/tutor/profile")
        if (req.files.image) {
            let image = req.files.image
            image.mv('./public/images/tutor-profile-img/' + id + ".jpg")
        }
    })
})

router.get('/students', verifyLogin, (req, res) => {
    tutorHelper.getStudents().then((students) => {
        console.log(students);
        res.render('tutor/students-list', { tutorData, students })
    })
})

router.get('/student-profile', verifyLogin, (req, res) => {
    res.render('tutor/student-profile')
})

router.get('/add-student',verifyLogin, (req, res) => {
    res.render('tutor/add-student')
})

router.post('/add-student', (req, res) => {
    tutorHelper.addStudent(req.body).then((id) => {
        res.redirect('/tutor/students')
        if (req.files && req.files.image) {
            let image = req.files.image
            image.mv('./public/images/students-profile/' + id + ".jpg")
        }


    })
})


router.get("/edit-student", verifyLogin, (req, res) => {
    res.render('tutor/edit-student')
})


router.get("/delete-student/:id",verifyLogin,(req,res)=>{
    let studentId = req.params.id
    tutorHelper.deleteStudent(studentId).then(()=>{
        res.redirect('/tutor/students')
    })
})


router.get('/logout', (req, res) => {
    req.session.tutorLoggedIn = false
    req.session.tutor = null
    res.redirect('/')
})

module.exports = router;
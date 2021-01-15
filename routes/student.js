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
    studentHelper.getHome().then((data)=>{

        res.render('student/student-home', {data, studentData })
    })
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
            req.session.studentLoggedIn = true
            res.redirect('/home')
        } else {
            req.session.studentloginErr = response.loginErr
            res.redirect("/login")
            req.session.studentLoggedIn = false
        }
    })
})

router.get('/otp-login',(req,res)=>{
    res.render('student/login-otp',{ "loginErr": req.session.studentloginErr })
})


router.post('/otp-login',(req,res)=>{
    studentHelper.otpLogin(req.body.email).then((response)=>{
        if(response.logStatus){
            req.session.student = response.student
            studentData.student = response.student
            res.redirect('/otp')
        }else{
            req.session.studentloginErr=response.loginErr
            res.redirect('/otp-login')
            req.session.studentLoggedIn = false
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
    // console.log(studentData.otp);
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
            res.redirect('/otp-login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.studentLoggedIn = false
    req.session.student = null
    res.redirect('/')
})

router.get("/assignments", verifyLogin, (req, res) => {
    studentHelper.getAssignment(req.session.student._id).then((data) => {
        res.render('student/assignment', { data, studentData })
    })
})


router.post('/add-assignment', (req, res) => {
    studentHelper.addAssignmet(req.body).then((data) => {
        res.redirect('/assignments')
        if (req.files && req.files.doc) {
            let doc = req.files.doc

            doc.mv('./public/doc/student-assignments/' + data._id+ ".pdf")
        }


    })
})
router.get("/doc/:id", (req, res) => {
    var Id = req.params.id
    res.render('doc/std-doc', { Id })
})


router.get("/delete-assignment/:id", verifyLogin, (req, res) => {
    let Id = req.params.id
    studentHelper.deleteAssignment(Id).then(() => {
        res.redirect('/assignments')
    })
})


router.get('/todays-task',verifyLogin, (req, res) => {
    studentHelper.getTasks().then((data)=>{
        console.log(data);
       res.render('student/today-task', {data, studentData })
    })
})


router.post("/attendance",(req,res)=>{
    
    let responce=req.body.media
    studentHelper.attendance(req.body).then(()=>{
       console.log(responce);
        res.json(responce)
    })
            
})

router.get("/announcement/:id", verifyLogin, (req, res) => {
    console.log(req.params.id);
    let Id = req.params.id
    console.log(Id);
    studentHelper.getAnnouncement(Id).then((data) => {
        console.log(data);
        res.render('student/announcement', {data, studentData })
    })
})

router.get("/event/:id", verifyLogin, (req, res) => {
    let Id = req.params.id
    studentHelper.getAnnouncement(Id).then(() => {
        res.redirect('/assignments')
    })
})





module.exports = router;
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
    console.log(tutorData);
    tutorData.login = req.session.tutorLoggedIn
    res.render("tutor/tutor-home", { tutorData })
})

router.post('/login', (req, res) => {
    tutorHelper.doLogin(req.body).then((response) => {
        if (response.logStatus) {
            req.session.tutorLoggedIn = true
            req.session.tutor = response.tutor
            tutorData.tutor = response.tutor
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

router.get('/student-profile/:id', verifyLogin, (req, res) => {
    let studentId = req.params.id
    tutorHelper.getStudentData(studentId).then((student) => {

        res.render('tutor/student-profile', { tutorData, student })
    })
})

router.get('/add-student', verifyLogin, (req, res) => {
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


router.get("/edit-student/:id", verifyLogin, (req, res) => {

    let studentId = req.params.id
    tutorHelper.getStudentData(studentId).then((student) => {

        res.render('tutor/edit-student', { student })
    })
})

router.post("/edit-student/:id", (req, res) => {
    let Id = req.params.id
    tutorHelper.editStudent(Id, req.body).then(() => {

        res.redirect('/tutor/student-profile/' + Id)

        if (req.files && req.files.image) {
            let image = req.files.image
            image.mv('./public/images/students-profile/' + Id + ".jpg")
        }
    })
})


router.get("/delete-student/:id", verifyLogin, (req, res) => {
    let studentId = req.params.id
    tutorHelper.deleteStudent(studentId).then(() => {
        res.redirect('/tutor/students')
    })
})


router.get('/logout', (req, res) => {
    req.session.tutorLoggedIn = false
    req.session.tutor = null
    res.redirect('/')
})

router.get("/assignments", verifyLogin, (req, res) => {
    console.log("dfasdfadsafsaSDFERHGTEGVFSDGBBFHF");
    tutorHelper.getAssignment().then((data) => {

        res.render('tutor/tutor-assignment', { data, tutorData })
    })
})

router.post('/add-assignment', (req, res) => {
    tutorHelper.addAssignmet(req.body).then((data) => {
        res.redirect('/tutor/assignments')
        if (req.files && req.files.doc) {
            let doc = req.files.doc

            doc.mv('./public/doc/assignments/' + data._id + ".pdf")
        }


    })
})

//Meadia viwes

//assingment
router.get("/doc/:id", (req, res) => {
    var Id = req.params.id
    res.render('doc/doc', { Id })
})

//nots-doc
router.get("/doc-note/:id", (req, res) => {
    var Id = req.params.id
    res.render('doc/doc-note', { Id })
})

//note-videos
router.get("/video-note/:id", (req, res) => {
    var Id = req.params.id
    res.render('doc/video-note', { Id })
})


router.get("/delete-assignment/:id", verifyLogin, (req, res) => {
    let Id = req.params.id
    tutorHelper.deleteAssignment(Id).then(() => {
        res.redirect('/tutor/assignments')
    })
})

router.get("/students-assignments/:id", verifyLogin, (req, res) => {
    let Id = req.params.id
    tutorHelper.getStudentAssignment(Id).then((data) => {
        data.Id = Id
        res.render('tutor/student-assignments', { data, tutorData })
    })
})
router.post("/save-assignments-mark/:id", (req, res) => {
    let studentId = req.body.studentId
    let Id = req.params.id
    tutorHelper.markAssignment(Id, req.body).then(() => {
        res.redirect('/tutor/students-assignments/' + studentId)
    })
})

router.get("/add-notes", verifyLogin, (req, res) => {
    console.log(tutorData);
    tutorHelper.getNots().then((data) => {
        res.render('tutor/notes', {data, tutorData })
    })
})
router.post('/add-notes',(req,res)=>{

    if(req.body.media=== 'youtube'){
        req.body.youtubeId=tutorHelper.notYputubeUrl(req.body.url)
    }

    tutorHelper.addNotes(req.body).then((data) => {
        console.log(data);
        res.redirect('/tutor/add-notes')
        if(req.body.media=== 'video'){
            let video = req.files.file
            video.mv('./public/videos/notes/' + data._id + ".mp4")
        }else if(req.body.media=== 'doc'){
            let doc = req.files.file
            doc.mv('./public/doc/notes/' + data._id + ".pdf")
        }


    })
       
        
    
})

router.get('/delete-note/:id',(req,res)=>{
    let Id = req.params.id
    tutorHelper.deleteNote(Id).then(() => {
        res.redirect('/tutor/add-notes')
    })
})

router.get('/today-task',(req,res)=>{
    tutorHelper.getTasks()
    res.render('tutor/today-task',{tutorData})
})

router.get('/set-task/:id',(req,res)=>{
    let Id = req.params.id
    tutorHelper.setNoteTask(Id,tutorData.taskID).then(() => {
        res.redirect('/tutor/add-notes')
    })
})

router.get('/set-task-assignment/:id',(req,res)=>{
    let Id = req.params.id
    tutorHelper.setAssinmentTask(Id,tutorData.taskID).then(() => {
        res.redirect('/tutor/assignments')
    })
})


module.exports = router;


var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var objectId = require("mongodb").ObjectID

module.exports = {

    doLogin: (tutorData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let tutor = await db.get().collection(collection.TUTOR_COLLECTION).findOne({ email: tutorData.email })
            if (tutor) {
                bcrypt.compare(tutorData.password, tutor.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.tutor = tutor
                        response.logStatus = true
                        resolve(response)
                    } else {
                        console.log('login faild pass');
                        response.logStatus = false
                        response.loginErr = "Invalid password"
                        resolve(response)
                    }
                })
            } else {
                console.log("login faild email");
                response.logStatus = false
                response.loginErr = "Invalid username"
                resolve(response)
            }
        })
    },
    editData: (tutorId, data) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.TUTOR_COLLECTION).updateOne({ _id: objectId(tutorId) }, {
                $set: {
                    name: data.name,
                    subject: data.subject,
                    class: data.class,
                    house: data.house,
                    place: data.place,
                    pin: data.pin,
                    number: data.number,
                    email: data.email
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    getTutorData: (tutorId) => {
        return new Promise(async (resolve, reject) => {
            let tutorData = await db.get().collection(collection.TUTOR_COLLECTION).findOne({ _id: objectId(tutorId) })
            resolve(tutorData)
        })
    },
    getStudents: () => {
        return new Promise(async (resolve, reject) => {
            let students = await db.get().collection(collection.STUDENT_COLLECTION).find().toArray()
            resolve(students)
        })
    },
    addStudent: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            console.log(data, "data");

            db.get().collection(collection.STUDENT_COLLECTION).insertOne(data).then((data) => {

                resolve(data.ops[0]._id)
            })
        })
    },
    deleteStudent: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION).removeOne({ _id: objectId(studentId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getStudentData: (studentId) => {
        return new Promise(async (resolve, reject) => {
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ _id: objectId(studentId) })
            resolve(student)
        })
    },
    editStudent: (Id, data) => {
        return new Promise(async (resolve, reject) => {
            if (data.password) {

                data.password = await bcrypt.hash(data.password, 10)

                db.get().collection(collection.STUDENT_COLLECTION).updateOne({ _id: objectId(Id) }, {
                    $set: {
                        name: data.name,
                        no: data.no,
                        class: data.class,
                        house: data.house,
                        place: data.place,
                        pin: data.pin,
                        number: data.number,
                        email: data.email,
                        password: data.password
                    }
                }).then((response) => {
                    resolve()
                })


            } else {

                db.get().collection(collection.STUDENT_COLLECTION).updateOne({ _id: objectId(Id) }, {
                    $set: {
                        name: data.name,
                        subject: data.subject,
                        class: data.class,
                        house: data.house,
                        place: data.place,
                        pin: data.pin,
                        number: data.number,
                        email: data.email
                    }
                }).then((response) => {
                    resolve()
                })
            }
        })
    },
    addAssignmet: (topic) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ASSIGNMENT_COLLECTION).insertOne(topic).then((data) => {
                console.log(data.ops[0]);
                resolve(data.ops[0])
            })
        })

    },
    getAssignment: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.ASSIGNMENT_COLLECTION).find().toArray()
            resolve(data)
        })

    },
    deleteAssignment: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ASSIGNMENT_COLLECTION).removeOne({ _id: objectId(Id) }).then((response) => {
                resolve()
            })
        })
    },
    getStudentAssignment: (Id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.STUDENT_ASSIGNMENT_COLLECTION).find({ studentId: Id }).toArray()
            resolve(data)
        })
    },
    markAssignment: (Id, data) => {
        return new Promise((resolve, reject) => {

            db.get().collection(collection.STUDENT_ASSIGNMENT_COLLECTION).updateOne({ _id: objectId(Id) }, {
                $set: {
                    mark: data.mark
                }
            }).then(() => {
                resolve()
            })
        })
    },
    addNotes: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTES_COLLECTION).insertOne(data).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    notYputubeUrl: (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11)
            ? match[2]
            : null;
    },
    getNots: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.NOTES_COLLECTION).find().toArray()
            resolve(data)
        })
    },
    deleteNote: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTES_COLLECTION).removeOne({ _id: objectId(Id) }).then((response) => {
                resolve()
            })
        })
    },
    setNoteTask: (noteId, tutorId) => {
        return new Promise(async (resolve, reject) => {
            let task = {
                tutorId: tutorId,
                note: noteId,
            }
            let fTask = await db.get().collection(collection.TASK_COLLECTION).findOne({ tutorId: tutorId })

            if (fTask) {
                db.get().collection(collection.TASK_COLLECTION).updateOne({ tutorId: tutorId }, {
                    $set: {
                        note: noteId
                    }
                }).then(() => {

                    resolve()
                })


            } else {

                db.get().collection(collection.TASK_COLLECTION).insertOne(task).then((data) => {
                    resolve()
                })
            }
        })
    },
    setAssinmentTask: (assId, tutorId) => {
        return new Promise(async (resolve, reject) => {
            let task = {
                tutorId: tutorId,
                assignmet: assId,
            }
            let fTask = await db.get().collection(collection.TASK_COLLECTION).findOne({ tutorId: tutorId })

            if (fTask) {
                db.get().collection(collection.TASK_COLLECTION).updateOne({ tutorId: tutorId }, {
                    $set: {
                        assignmet: assId
                    }
                }).then(() => {

                    resolve()
                })


            } else {

                db.get().collection(collection.TASK_COLLECTION).insertOne(task).then((data) => {
                    resolve()
                })
            }
        })
    },
    getTasks: () => {
        return new Promise(async (resolve, reject) => {
            let data = {
                note: [],
                assignment: []
            }
            let Task = await db.get().collection(collection.TASK_COLLECTION).find().toArray()
            console.log(Task);
            console.log("task length :::::::::", Task.length);
            for (i = 0; i < Task.length; i++) {
                console.log("gfhdfsh ====", i);
                if (Task[i].note) {

                    data.note[i] = await db.get().collection(collection.NOTES_COLLECTION).findOne({ _id: objectId(Task[i].note) })
                }
                if (Task[i].assignmet) {

                    data.assignment[i] = await db.get().collection(collection.ASSIGNMENT_COLLECTION).findOne({ _id: objectId(Task[i].assignmet) })
                }
                console.log(data);
            }
            console.log('========================dsfdsgds=gdsghfdt=hfthfffff========================');
            console.log(data);
            resolve(data)
        })
    },
    getattendance: () => {
        return new Promise(async (resolve, reject) => {
            var data = []
            let dateObj = new Date()
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var crDate = day + "/" + month + "/" +year ;
            console.log('crdate ', crDate);

            let students = await db.get().collection(collection.STUDENT_COLLECTION).find().toArray()
            
            for (i = 0; i < students.length; i++) {
                students[i]._id=students[i]._id.toString()
                let attData={}
                attData.studentId=students[i]._id
                attData.name=students[i].name
                attData.no=students[i].no
                let attendance = await db.get().collection(collection.ATTENDANCE_COLLECTION).findOne({studentId:students[i]._id,date:crDate})
                console.log(attendance);
                if(attendance){
                    attData.attendance="P"
                }else{
                    attData.attendance="A"

                }
                data[i]=attData

            }

            console.log(data);
            resolve(data)
        })

    }






}






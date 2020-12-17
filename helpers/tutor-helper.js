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
    setNoteTask: (noteId, taskId) => {
        return new Promise(async (resolve, reject) => {
            let task = {
                note: noteId,
                assignmet:null
            }
            let fTask = await db.get().collection(collection.TASK_COLLECTION).find().toArray()

            if (fTask) {
                db.get().collection(collection.TASK_COLLECTION).updateOne({ _id: objectId(fTask[0]._id) }, {
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
    setAssinmentTask: (assId, taskId) => {
        return new Promise(async (resolve, reject) => {
            let task = {
                note: null,
                assignmet: assId,
            }
            let fTask = await db.get().collection(collection.TASK_COLLECTION).find().toArray()
           
            if (fTask) {
                db.get().collection(collection.TASK_COLLECTION).updateOne({ _id: objectId(fTask[0]._id) }, {
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






}






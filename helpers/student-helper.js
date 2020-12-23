var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var unirest = require('unirest')
var objectId = require("mongodb").ObjectID

module.exports = {
    doLogin: (studentData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ email: studentData.email })
            if (student) {
                bcrypt.compare(studentData.password, student.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.student = student
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
    sendOtp: (number) => {
        return new Promise(async (resolve, reject) => {
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ number: number })
            if (!student) reject()

            var req = unirest('POST', 'https://d7networks.com/api/verifier/send')
                .headers({
                    'Authorization': 'Token ae578143f19da9a219e40660c3b7a9b99934984e'
                })
                .field('mobile', '91' + number)
                .field('sender_id', 'SMSINFO')
                .field('message', 'your otp for ECLASS activation is {code}')
                .field('expiry', '900')
                .end(function (res) {

                    resolve(res.body.otp_id)
                })
        });
    },
    verifyOtp: (otpId, otp) => {
        return new Promise(async (resolve, reject) => {
            var req = unirest('POST', 'https://d7networks.com/api/verifier/verify')
                .headers({
                    'Authorization': 'Token ae578143f19da9a219e40660c3b7a9b99934984e'
                })
                .field('otp_id', otpId)
                .field('otp_code', otp)
                .end(function (res) {
                    resolve(res.body.status)
                })
        });
    },
    getAssignment: (Id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.STUDENT_ASSIGNMENT_COLLECTION).find({ studentId: Id }).toArray()
            resolve(data)
        })

    },
    addAssignmet: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.STUDENT_ASSIGNMENT_COLLECTION).insertOne(data).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    getTasks: () => {
        return new Promise(async (resolve, reject) => {
            let data = {
                note: [],
                assignment: []
            }
            let Task = await db.get().collection(collection.TASK_COLLECTION).find().toArray()
            for (i = 0; i < Task.length; i++) {
                if (Task[i].note) {

                    data.note[i] = await db.get().collection(collection.NOTES_COLLECTION).findOne({ _id: objectId(Task[i].note) })
                }
                if (Task[i].assignmet) {

                    data.assignment[i] = await db.get().collection(collection.ASSIGNMENT_COLLECTION).findOne({ _id: objectId(Task[i].assignmet) })
                }
            }
            resolve(data)
        })
    },
    attendance: (data) => {
        return new Promise(async (resolve, reject) => {
            let dateObj = new Date()
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();

            data.date = year + "/" + month + "/" + day;


            delete data.media
            let att = await db.get().collection(collection.ATTENDANCE_COLLECTION).findOne({ studentId: data.studentId, date: data.date })
            if (!att) {
                db.get().collection(collection.ATTENDANCE_COLLECTION).insertOne(data).then((data) => {
                    resolve()
                    console.log('added');
                })
            } else {
                console.log('resolveed');
                resolve()
            }
        })
    },
    otpLogin: (email) => {
        return new Promise(async (resolve, reject) => {
            let response={}
            let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({ email: email })
            if (student) {
                response.student = student
                response.logStatus = true
                resolve(response)
            } else {
                response.logStatus = false
                response.loginErr = "Invalid username"
                resolve(response)

            }
        })
    }







}
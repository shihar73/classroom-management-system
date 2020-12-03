var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var objectId=require("mongodb").ObjectID

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
            
            db.get().collection(collection.TUTOR_COLLECTION).updateOne({_id:objectId(tutorId)},{
                $set:{
                    name:data.name,
                    subject:data.subject,
                    class:data.class,
                    house:data.house,
                    place:data.place,
                    pin:data.pin,
                    number:data.number,
                    email:data.email
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    getTutorData:(tutorId)=>{
        return new Promise(async(resolve,reject)=>{
            let tutorData = await db.get().collection(collection.TUTOR_COLLECTION).findOne({_id: objectId(tutorId) })
            resolve(tutorData)
        })
    },
    getStudents:()=>{
        return new Promise(async(resolve,reject)=>{
            let students=await db.get().collection(collection.STUDENT_COLLECTION).find().toArray()
            resolve(students)
        })
    },
    addStudent: (data) => {
        return new Promise(async(resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            console.log(data, "data");

            db.get().collection(collection.STUDENT_COLLECTION).insertOne(data).then((data) => {
                
                resolve(data.ops[0]._id)
            })
        })
    },
    deleteStudent:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.STUDENT_COLLECTION).removeOne({_id:objectId(studentId)}).then((response)=>{
                resolve(response)
            })
        })
    }





}
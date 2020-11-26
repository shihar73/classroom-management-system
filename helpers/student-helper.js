var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')

module.exports={
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
    }
}
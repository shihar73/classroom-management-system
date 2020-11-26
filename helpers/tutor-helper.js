var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')

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
    }
}
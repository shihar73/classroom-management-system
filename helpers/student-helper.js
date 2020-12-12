var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var unirest = require('unirest')

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
    },
    sendOtp:(number)=>{
        return new Promise(async(resolve,reject)=>{
            let student=await db.get().collection(collection.STUDENT_COLLECTION).findOne({number:number})
            if(!student)reject()

            var req =unirest('POST', 'https://d7networks.com/api/verifier/send')
            .headers({
                'Authorization':'Token ae578143f19da9a219e40660c3b7a9b99934984e'
            })
            .field('mobile','91'+number)
            .field('sender_id','SMSINFO')
            .field('message','your otp for ECLASS activation is {code}')
            .field('expiry','900')
            .end(function(res){
                
                resolve(res.body.otp_id)
            })
        });
    },
    verifyOtp:(otpId,otp)=>{
        return new Promise(async(resolve,reject)=>{
            var req =unirest('POST', 'https://d7networks.com/api/verifier/verify')
            .headers({
                'Authorization':'Token ae578143f19da9a219e40660c3b7a9b99934984e'
            })
            .field('otp_id',otpId)
            .field('otp_code',otp)
            .end(function(res){
                resolve(res.body.status)
            })
        });
    },
    getAssignment:()=>{
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.ASSIGNMENT_COLLECTION).find().toArray()
            resolve(data)
        })
    
}
}
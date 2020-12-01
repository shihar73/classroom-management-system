var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
module.exports = {

    addTutor: (data) => {
        return new Promise(async(resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            console.log(data, "data");

            db.get().collection(collection.TUTOR_COLLECTION).insertOne(data).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    addStudent: (data) => {
        return new Promise(async(resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            console.log(data, "data");

            db.get().collection(collection.STUDENT_COLLECTION).insertOne(data).then((data) => {
                console.log();
                resolve(data.ops[0])
            })
        })
    }
}
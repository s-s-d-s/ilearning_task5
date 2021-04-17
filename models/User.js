const {Schema, model} = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registerAt: {type: Date, default: Date.now },
    status: { type: String, default: 'OK'}
})

module.exports = model('User', schema)
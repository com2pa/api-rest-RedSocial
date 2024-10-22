const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Firstname: {
        type: String,
        required: true
    },
    lastname:String,

    nick:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'default.png'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    verificacion:{
        type: Boolean,
        default: false
    }
})
userSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    }
})
const User = mongoose.model('User',userSchema);

module.exports = User;
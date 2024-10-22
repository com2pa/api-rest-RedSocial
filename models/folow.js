const mongoose =require('mongoose');

// Definir esquema de la colección 'users'
const followSchema = mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
    
})

followSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Follow = mongoose.model('Follow',followSchema);

module.exports = Follow;
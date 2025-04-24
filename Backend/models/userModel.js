const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
     
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    age: {
        type: Number,
        required: true,  // or you can set it to false if you don't want to make it mandatory
    },
    weight: {
        type: Number,
        required: true,  // You can adjust this depending on whether weight is mandatory
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'], // You can customize this if necessary
    },
    height: {
        type: Number,
        required: true,  // Optional based on your needs
    },
      emergencyContactEmail: {
        type: String, // Store the emergency contact's email
        required: true,
      },
      emergencyContactPhone: {
        type: String, // Store the emergency contact's phone number
        required: true,
      },
      bloodGroup: {
        type: String, // Store the user's blood group
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Other'], // You can customize this list
      }
},{timestamps:true})

const User=mongoose.model('userJeevafit',userSchema)

module.exports= User
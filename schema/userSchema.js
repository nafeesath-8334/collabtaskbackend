const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'member'
  },
  Image: {
    type: String,
    
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  resetPasswordToken:String,
resetPasswordExpires:Date,
},

 {
  timestamps: true
});


const User=mongoose.model("User",userSchema)
module.exports=User
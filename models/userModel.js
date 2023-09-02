const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"A user must have a name"],
        minlength : [3, "Name must be of 3 characters"]
    },
    email : {
        type : String,
        unique: true,
        required : [true,"A user must have a valid email"],
        lowercase : true,
        validate : [validator.isEmail,'Please provide a vaild email']
    },
    mobile : {
        type : String,
        unique: true,
        required : [true,"A user must have a valid mobile number"],
        validate : [validator.isMobilePhone,'Please provide a vaild mobile number'],
        minlength : [10, "Please enter a valid 10 digit mobile number"],
        maxlength : [10, "Please enter a valid 10 digit mobile number"]
    },
    password : {
        type : String,
        required : [true,"A user must have a password"],
        minlength : [8, "Password must contain atleast 8 characters"],
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true,"Please confirm your password!"],
        validate : {
            // This only works on CREATE and SAVE!!!!
            validator : function(el){
                return el === this.password;
            }
        }
    },
    passwordChangedAt : {
        type : Date
    },
    role: {
        type: String,
        enum: ['user', 'premium-user', 'advisor', 'admin'],
        default: 'user'
      },
});

//
userSchema.pre('save',async function(next){
    // Only run this function if password is modified !!!
    if(!this.isModified('password')) return next();
    
    // Hashing the password cost set to 12
    this.password = await bcrypt.hash(this.password,12);
    // Removing passwordConfirm from the object
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);
        //console.log(changedTimestamp,JWTTimestamp);
        return changedTimestamp>JWTTimestamp;
    }
    return false;
}

const User = mongoose.model('User',userSchema);

module.exports = User;
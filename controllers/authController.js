const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const {promisify} = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validator = require('email-validator');

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

exports.verifyEmail = catchAsync(async(req,res,next)=> {
    if(req.body.email&&validator.validate(req.body.email)){
        next();
    }
    else{
        return next(new AppError('Please enter valid email address!',404));
    }
});

exports.signup = catchAsync(async(req,res,next) => {
    let newUser;
        if(req.body.secretKey===process.env.SECRET_KEY){
            newUser =  await User.create({
                name : req.body.name,
                email : req.body.email,
                mobile : req.body.mobile,
                password : req.body.password,
                passwordConfirm : req.body.passwordConfirm,
                role : req.body.role
            });
        }
        else{
            newUser =  await User.create({
                name : req.body.name,
                email : req.body.email,
                mobile : req.body.mobile,
                password : req.body.password,
                passwordConfirm : req.body.passwordConfirm
            });
        }
        const token = signToken(newUser._id);
        res.status(201).json({
            status : 'success',
            token : token
    });
});

exports.signupAdmin = catchAsync(async(req,res,next) => {
    const secretKey = req.body.secretKey;
    //console.log(secretKey);
    if(secretKey===process.env.SECRET_KEY){
        req.body.role = "admin";
        next();
    }
    else{
    return next(new AppError("Permission not granted!",403));
    }
});

exports.signupAdvisor = catchAsync(async(req,res,next) => {
    const secretKey = req.body.secretKey;
    if(secretKey===process.env.SECRET_KEY){
        req.body.role = "advisor";
        next();
    }
    else{
    return next(new AppError("Permission not granted!",403));
    }
});

exports.login = catchAsync(async(req,res,next) => {
    const { email , password } = req.body;
    // 1. Check if email and password exist
    //console.log(email,password);
    if(!email || !password){
        res.status(400).json({
            status : "fail",
            data : {
                message : "Please provide email and password..."
            }
        });
    }
        // 2. Check if user exists and password is correct
        const user = await User.findOne({email : email}).select('+password');

        if(!user || !(await user.correctPassword(password,user.password))){
        return res.status(401).json({
            status : "fail",
            message : "Please provide valid credentials!!!"
        });
        }
        // 3. If everything is ok, send token to client
        const token = signToken(user._id);
        res.status(200).json({
        status : "success",
        token : token
        });
});

exports.protect = catchAsync(async(req,res,next) => {
    // 1. Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
          );
    }
    
    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //console.log(decoded);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token no longer exists.',401));
    }

    // 4. Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('Validation expired. Please login again!',401));
    }
    //Grant Access to Protected routes
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        // roles permitted - ['admin','advisor']
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action!',403));
        }
        next();
    }
}

exports.forgotPassword = catchAsync()
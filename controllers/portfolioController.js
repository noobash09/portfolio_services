const catchAsync = require('../utils/catchAsync');
const Portfolio = require('./../models/portfolioModel');
const AppError = require('../utils/appError');

exports.getAllPortfolios = catchAsync(async (req,res,next)=>{
    const portfolios = await Portfolio.find({createdBy : 'Expert'});
    res.status(200).json({
        status: "success",
        results : portfolios.length,
        data : {
            portfolios : portfolios,
            
        }
    });
});

exports.createPortfolio = catchAsync(async (req,res,next)=>{
    // const newPortfolio = new Portfolio({});
    // newPortfolio.save();
    const newPortfolio = await Portfolio.create(req.body);
    res.status(201).json({
        status : 'success',
        data : {
            portfolio : newPortfolio
        }
    });
});

exports.getPortfolio = catchAsync(async (req,res,next)=>{
    // console.log(req.params);
    const portfolio = await Portfolio.findById(req.params.id); 

    if(!portfolio){
        return next(new AppError('No Tour find with that ID',404));
    }

    res.status(200).json({
        status: "success",
        data : {
            portfolio : portfolio
        }
    });
});

exports.updatePortfolio = catchAsync(async (req,res,next)=>{
        const portfolio = await Portfolio.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
        });

        if(!portfolio){
            return next(new AppError('No Tour find with that ID',404));
        }

        res.status(200).json({
        status: "success",
        data : {
            portfolio : portfolio
        }
    });  
});

exports.deletePortfolio = catchAsync(async (req,res,next)=>{
        const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
        
        if(!portfolio){
            return next(new AppError('No Tour find with that ID',404));
        }

        res.status(204).json({
        status: "success",
        data : null
    });  
});
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true,'A Portfolio must have a name!'],
        unique: true
    },
    stocks : [
        {
            name : {
                type : String,
                required : [true,'A Stock must have a name!']
            },
            allocation : {
                type : Number,
                required : [true,'A Stock must have a valid allocation in portfolio!']
            }
        }
    ],
    mutualFunds : [
        {
            name : {
                type : String,
                required : [true,'A Mutual Fund must have a name!']
            },
            allocation : {
                type : Number,
                required : [true,'A Mutual Fund must have a valid allocation in portfolio!']
            }
        }
    ],
    premium:{
        type : Boolean,
        default:false
    },
    createdBy : {
        type : String,
        required : [true,'A Portfolio must have a Owner!'],
    },
    reviews : [
        {
            comment : {
                type : String,
                required : [true , 'A review must consist of a comment!!!']
            },
            ratings : {
                type : Number,
                required : [true, 'A review must have some rating!!!'],
                min : 1.0,
                max : 5.0
            }
        }
    ]
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true} 
});

portfolioSchema.virtual('rating').get(function(){
    if(this.reviews.length<10){
        return 4.5;
    }
    else{
        let ratings = 0.0;
        for(var i = 0;i<this.reviews.length;++i){
            ratings += reviews[i]['ratings'];
        }
        return ratings/this.reviews.length;
    }
});

// Document Middleware: runs before .save() and .create()
portfolioSchema.pre('save',function(next){
    if(this.mutualFunds.length===0&&this.stocks.length===0){
        const err = new Error('Portfolio must have atleast one stock or mutual fund!');
        // console.log(err);
        next(err);
    }
    else{
        next();
    }
});

// Query Middleware
portfolioSchema.pre(/^find/,function(next){
    this.find({premium : {$ne : true}});
    next();
});

//Aggregation Middleware
portfolioSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match: { premium : { $ne : false}}});
    next();
})


const Portfolio = mongoose.model('Portfolio',portfolioSchema);

module.exports = Portfolio;
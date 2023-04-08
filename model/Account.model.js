const mongoose=require('mongoose')

const accountSchema=mongoose.Schema({
    name:{type:String,required:true},
    gender:{type:String,required:true},
    dob:{type:Date,required:true},
    email:{type:String,required:true},
    mobile:{type:Number,required:true},
    address:{type:String,required:true},
    balance:{type:Number,required:true},
    adharNo:{type:Number,required:true},
    panNo:{type:Number,required:true},
    transactions:{type:Array}
})

const AccountModel=mongoose.model('account',accountSchema)

module.exports={AccountModel}
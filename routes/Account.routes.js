const express = require('express');
const { AccountModel } = require('../model/Account.model');

const accRouter=express.Router()

accRouter.post('/open',async(req,res)=>{
    try {
        const {panNo}=req.body
        const accCheck=await AccountModel.find({panNo})
        if(accCheck.length>0){
            res.send({message:"Account already exists with this Pan Number"})
        }else{
            let account = new AccountModel(req.body);
            await account.save();
            res.send({ message: "Account Created Successfully" });
        }
        
    } catch (error) {
        res
          .status(400)
          .send({ message: "could not open account,error occured" ,error:error.message });
    }
})

accRouter.patch('/update',async(req,res)=>{
    try {
        const {id}=req.body
        await AccountModel.findByIdAndUpdate(id,req.body)
        res.status(200).send({message: "Account Updated Successfully"})
    } catch (error) {
        res.status(400).send({message:"Could not update account,error occured" ,error:error.message})
    }
})

accRouter.put('/deposit',async(req,res)=>{
    const {id,amount}=req.body
    const account=await AccountModel.findById(id)
    if(!account){
        res.status(404).send('Account not found')
    }else{
        account.balance += amount;
        account.transactions.push({
          type: "credit",
          amount: amount,
          date: new Date(),
        });
        await account.save();
        res.send("Amount Deposited Successfully");
    }
    
})

accRouter.put('/withdraw',async(req,res)=>{
    const {id,amount}=req.body
    const account = await AccountModel.findById(id);
    if (!account) {
      return res.status(404).send("Account not found");
    }
    if(account.balance<amount){
      return  res.status(400).send('Insufficient Balance')
    }else{
        account.balance-=amount
        account.transactions.push({
            type:"debit",
            amount:amount,
            date:new Date()
        })
        await account.save()
        res.send('Withdrawn Successfully');
    }
})

accRouter.put('/transfer',async(req,res)=>{
    const fromAccount=await AccountModel.findById(req.body.id)
    if(!fromAccount){
        return res.status(404).send('Account not found')
    }

    const toAccount=await AccountModel.findOne({panNo:req.body.panNo})
    if(!toAccount){
        return res.status(404).send("Recepient not found");
    }

    const amount=req.body.amount
    if(fromAccount.balance<amount){
        return res.status(400).send('Insufficient Balance')
    }
    fromAccount.balance-=amount
    fromAccount.transactions.push({
        type:'debit',
        amount:amount,
        date:new Date(),
        to:{
            name:toAccount.name,
            email:toAccount.Email,
            panNo:req.body.panNo
        }
    })
    toAccount.balance+=amount
    toAccount.transactions.push({
        type:"credit",
        amount:amount,
        date:new Date(),
        from:{
            name:fromAccount.name,
            email:fromAccount.email,
            panNo:fromAccount.panNo
        }
    })
    await fromAccount.save()
    await toAccount.save()
    res.send('Amount transferred successfully')
})

accRouter.get('/',async(req,res)=>{
    const {panNo}=req.body
    const account=await AccountModel.findOne({panNo})
    if(!account){
        res.status(400).send('Account not found')
    }else{
        res.send(account)
    }

})

accRouter.delete('/delete',async(req,res)=>{
    const {id}=req.body
    const account=await AccountModel.findByIdAndDelete(id)
    if(!account){
        return res.status(400).send('Account not found')
    }
    res.send('Account closed successfully')
})

module.exports ={accRouter}
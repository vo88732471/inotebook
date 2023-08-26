const express=require('express');
const router=express.Router();
const fetchuser=require("../middleware/fetchuser")
const Note=require("../models/Note")
const { body, validationResult } = require('express-validator');

//ROUTE 1:get all the notes GET "api/auth/fetchallnotes" login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const note=await Note.find({user:req.user.id})
        res.json(note)
        
    }  catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error occured")
    }
    
});

//ROUTE 2:add all the notes POST "api/auth/addnotes" login required
router.post('/addnotes',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Enter a valid description').isLength({min:5}),
],async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({"errors": errors.array()});
    }
    const note=new Note({
    title,
    description,
    tag,
    user:req.user.id
    })
    const saveNote=await note.save()
    res.json({saveNote})
    } catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error occured")
    }
});

//ROUTE 3:update an existing notes POST "api/auth/updatenotes" login required
router.put('/updatenotes/:id',fetchuser,async (req,res)=>{
 try {
    const {title,description,tag}=req.body;
    //create newNote object
    const newNote={};
    if(title)newNote.title=title;
    if(description)newNote.description=description;
    if(tag)newNote.tag=tag;
   
    //find note and update
    let note= await Note.findById(req.params.id);
    if(!note)return res.status(404).send(" note not found");

    if(note.user.toString() != req.user.id)return res.status(401).send("you are Not allowed");
     
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    res.json({note})
 }catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error occured")
 }

});

//ROUTE 4:delete an existing notes DELETE "api/auth/deletenotes" login required
router.delete('/deletenotes/:id',fetchuser,async (req,res)=>{
 try {
    //find note and delete
    let note= await Note.findById(req.params.id);
    if(!note)return res.status(404).send(" note not found");

    if(note.user.toString() != req.user.id)return res.status(401).send("you are Not allowed");
    
    note=await Note.findByIdAndDelete(req.params.id);
    res.json({"sucess":"deleted",note:note})
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error occured")
}

});
module.exports=router
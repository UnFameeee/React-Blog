const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//CREATE POST
router.post("/", async(req, res)=>{ 
    const newPost = new Post(req.body)
    try{
        const savedPost = newPost.save();
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err) 
    }
})


//UPDATE POST
router.put("/:id", async(req, res)=>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try{
            const updateUser = await User.findByIdAndUpdate(
                req.params.id, 
                {
                    $set: req.body
                },
                {new: true }
            ); 
            res.status(200).json(updateUser);
        }catch(err){
            //We didn't make exception handler
            //so just return Error500 -> sthg wrong with Database
            res.status(500).json(err)
        }
    }else{
        res.status(401).json("You can update only your account")
    }
})


//DELETE POST
router.delete("/:id", async(req, res)=>{    
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findById(req.params.id);
            try{
                await Post.deleteMany({username: user.username})
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            }catch(err){
                res.status(500).json(err)
            }
        }catch(err){
            res.status(404).json("User not found!");
        }
        
    }else{
        res.status(401).json("You can update only your account")
    }
})


//GET POST
router.get("/:id", async(req, res)=>{  
    try{
        const user = await User.findById(req.params.id);
        // const {password, ...others} = user._doc;
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err) 
    }
})

module.exports = router
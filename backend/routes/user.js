const express = require("express")
const zod = require("zod")
const {JWT_SECRET} = require("../config")
const {User, Account} = require("../db")
const jwt = require('jsonwebtoken');
const { authMiddleware } = require("../middleware");

const router  = express.Router();
app.use(express.json());


const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    
    const { username, firstName, lastName, password } = req.body;
  
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username:req.body.username
    })

    if (existingUser){
        return res.status(411).json({
            msg:"username already exists"
        })
    }

    const user = await User.create({
            username,
            firstName,
            lastName,
            password
        });

    const userId = user._id;

    await Account.create({
        userId,
        balance: Number((1 + Math.random() * 10000).toFixed(2))
    })

    const token = jwt.sign({userId , JWT_SECRET});
    res.json({
        msg:"user created successfully",
        token : token
    })



});


router.post("/signin",async (req, res) => {

    const {username , password} =  req.body;
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"invalid inputs"
        })
    }

    const user = await User.findOne({
        username,
        password
    })

    if(user){
        const token = jwt.sign({userId:user._id} ,JWT_SECRET)
        res.json({
            token:token
        })
        return;
    }

    res.status(411).json({
        msg:"error while logging in"
    })
});


const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/",authMiddleware,async (req, res) => {

    const result = updateBody.safeParse(req.body);
    if(!result.success){
        return res.status(411).json({
            msg:"Error while updating information"
        })
    }

    await User.updateOne({_id:req.userId} , req.body);

    res.json({
        msg:"Updated successfully"
    })



});


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// signup route controller
exports.signup = async(req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        const userExist = await User.findOne({email});
        // checking whether user exist or not
        if(userExist){
            res.status(400).json({
                success: false,
                message: "User already Exist"
            })
        }
        // hashing password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }catch(error){
            res.statu(500).json({
                success:false,
                message:"Error occur while hashing password",
            })
        }
        // creating user
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role:role
        });
        await user.save();

        res.status(201).json({
            success:true,
            message: 'User created successfully'
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occur while signing up"
        })
    }
}


// Login route handler
exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:'Please fill all the details carefully'
            })
        }


        // finding user
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User not registered'
            })
        }

        const payload = {
            email : user.email,
            // using this id we can find user in user database and fetch all the information
            id: user._id,
            // it is used for authorization (check whether user is admin or student)
            role: user.role
        };
        
        //verifying password and generating jwt token
        if(await bcrypt.compare(password, user.password) ){
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: '1d'
                                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            console.log(user);
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            res.cookie('token',token,options).status(200).json({
                success: true,
                message: 'Login Successfully',
                token,
                user
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Incorrect Password'
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occur while login',
            error
        })
    }
}
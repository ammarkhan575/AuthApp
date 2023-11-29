const express = require('express');
const router = express.Router();

// import controllers 
const {login, signup} = require('../Controllers/Auth')

//middleware
const {auth,isStudent,isAdmin} = require('../middlewares/auth');

// login route
router.post('/login', login);

// signup route
router.post('/signup', signup);

// protected route
router.get('/student', auth, isStudent, (req,res)=>{
    res.json({
        success:true,
        message: "Welcome to the protected route for students"
    })
});

router.get('/admin', auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "Welcome to the protected route for admin"
    })
});


module.exports = router;
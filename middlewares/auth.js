const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try{
        // my way
        // const token = (req.rawHeaders[req.rawHeaders.length-1]).replace("token=","");
        // OR
        // const token = (req.rawHeaders[req.rawHeaders.length-1]).splice(6);

        // best way 
        // const token = req.header("Authorization").replace("Bearer ", "");
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");


        console.log(token);
        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: 'Token Missing'
            })
        };

        try{
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

        }catch(error){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        // execute next middleware
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Authentication Failed'
        })
    }
};

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== 'Student'){
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students'
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success: false,
            message: 'User role is not matching'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== 'Admin'){
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin'
            })
        }
        next();
    }catch(error){
        res.status(401).json({
            success: false,
            message: 'User role is not matching'
        })
    }
}
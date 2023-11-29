const mongoose = require('mongoose');


const connect = () =>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('DB connected Successfully');
    })
    .catch((error)=>{
        console.log(error);
        console.log("Something happens while connecting to database");
    })
}

module.exports = connect;
// const { urlencoded } = require('express')
// var express = require('express')
// require('dotenv').config()

// const multer = require("multer")
// const path = require("path")


// var storage = multer.diskStorage({
//     destination: function (request,file,callback){
//         callback(null,'./uploads')
//     },
//     filename:function (request,file,callback){
//         console.log(file)
//         callback(null,file.fieldname,"-",Date.now() +path.extname(file.originalname ))
//     }
// })

// const upload = multer({storage:storage});
// var app = express();
// app.use(urlencoded({extended:true}))


// app.post("/add-post", upload.single('profile_pictue'),(req,res)=>{
// console.log("below is data posted")
// console.log(req.body)
// console.log("Name=", req.body.name)
// console.log("Experience=", req.body.experience)
//     res.send(req.body)
//     console.log(req.body)
// })





// app.listen(5000)

const { urlencoded } = require('express');
const express = require('express');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
require("./db/config")

const User = require("./db/user")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB file size limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // Set field name for file upload

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

const app = express();

app.use(urlencoded({ extended: true }));

app.post('/add-user', upload, async (req, res) => {
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    // console.log('Below is data posted:');
    // console.log(req.body);
    //res.send(req.file);
    // console.log('Image=', req.file.filename);

    // Code to save data to database here
    // ...
    // const { userlist } = req.body;
    // const newUser = new User({ userlist, createdAt: Date.now() })
    // let result = await newUser.save()
    // res.send(result)

    const { name, email } = req.body;
    const newUser = new User({ image: req.file.filename, name, email, createdAt: Date.now() });
    let result = await newUser.save();
    res.send(result);
});



//get api

app.use("/list-user", async (req, res) => {
    let userlist = await User.find()
    res.send(userlist)

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

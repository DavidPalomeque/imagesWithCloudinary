//Dependecies installed : 
//express express-handlebars mongoose multer cloudinary express-session connect-flash
//cross-env dotenv fs-extra nodemon -D

//MODULES
const express = require("express")
const exphbs = require("express-handlebars") //View engine
const path = require("path") 
const multer = require("multer") // Manage files/images
const session = require("express-session") 
const flash = require("connect-flash") // flash messages

//INITIALIZATIONS
const app = express()
require("dotenv").config() // Enviroment variables
require("./database")

//SETTTINGS
app.set("port" , process.env.PORT)
app.set("views" , path.join(__dirname , "views")) // Where the views are
app.engine(".hbs" , exphbs({ // setting up the view engine
    defaultLayout : "main",
    layoutsDir : path.join(app.get("views") , "layouts"),
    partialsDir : path.join(app.get("views") , "partials"),
    extname : ".hbs"
}))
app.set("view engine" , "hbs")

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended : false}))
const storage = multer.diskStorage({ //setting up multer
    destination : path.join(__dirname , "public/images"),
    filename : (req , file , cb) => {
        cb(null , new Date().getTime() + path.extname(file.originalname))
    }
})
app.use(multer({storage}).single("file"))
app.use(session({ // I did this because flash doesn´t work without it 
    secret : "secret",
    resave : true ,
    saveUninitialized : true
}))
app.use(flash())


//GLOBAL VARIABLES
app.use((req , res , next) => { // Types of flash messages
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//ROUTES
app.use(require("./routes/index"))

//SERVER
app.listen(app.get("port") , () => {
    console.log("Server on port " + app.get("port"))
})

//MODULES
const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const multer = require("multer")
const session = require("express-session")
const flash = require("connect-flash")

//INITIALIZATIONS
const app = express()
require("dotenv").config()
require("./database")

//SETTTINGS
app.set("port" , process.env.PORT)
app.set("views" , path.join(__dirname , "views"))
app.engine(".hbs" , exphbs({
    defaultLayout : "main",
    layoutsDir : path.join(app.get("views") , "layouts"),
    partialsDir : path.join(app.get("views") , "partials"),
    extname : ".hbs"
}))
app.set("view engine" , "hbs")

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended : false}))
const storage = multer.diskStorage({
    destination : path.join(__dirname , "public/images"),
    filename : (req , file , cb) => {
        cb(null , new Date().getTime() + path.extname(file.originalname))
    }
})
app.use(multer({storage}).single("file"))
app.use(session({
    secret : "secret",
    resave : true ,
    saveUninitialized : true
}))
app.use(flash())


//GLOBAL VARIABLES
app.use((req , res , next) => {
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

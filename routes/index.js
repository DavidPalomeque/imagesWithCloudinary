const router = require("express").Router()
const Image = require("../models/image")
const cloudinary = require("cloudinary")
const fs = require("fs-extra")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//INDEX ROUTE
router.get("/" , (req , res) => {
    res.render("index")
})


//IMAGES ROUTE
router.get("/images" , async (req , res) => {
    const images = await Image.find()
    res.render("images" , {images})
})

router.get("/images/:_id" , async (req , res) => {
    const _id = req.params
    const image = await Image.findById(_id)
    if (!image) {
        req.flash("error_msg" , "This image doesn´t exists")
        res.redirect("/images")
    } else {
        res.render("seeone" , {image})
    }
})

router.get("/images/delete/:_id" , async (req , res) => {
    const _id = req.params
    const image = await Image.findByIdAndDelete(_id)
    const result = await cloudinary.v2.uploader.destroy(image.public_id)
    .then(done => {
        req.flash("success_msg" , "Done !")
        res.redirect("/images")
    })
    .catch(err => {
        req.flash("error_msg" , "Some error happened...")
        res.redirect("/images")
    })
})


//ADD IMAGE ROUTE
router.get("/addimage" , (req , res) => {
    res.render("addimage")
})

router.post("/addimage" , async (req , res) => {
    const {title , description} = req.body

    if (!title) {
        req.flash("error_msg" , "A title is needed")
        res.redirect("/addimage")
    } else {
        const file = req.file
        if (!file) {
            req.flash("error_msg" , "A file is needed")
            res.redirect("/addimage")
        } else {
            const result = await cloudinary.v2.uploader.upload(req.file.path)

            const newImage = new Image({
                title : title ,
                description : description ,
                imageURL : result.url , 
                public_id : result.public_id
            })
        
            await newImage.save()
            await fs.unlink(req.file.path)
            .then(done => {
                req.flash("success_msg" , "Done !")
                res.redirect("/images")   
            })    
            .catch(err => {
                req.flash("error_msg" , "Some error happened...")
                res.redirect("/images")
            })
        }
    }
})

module.exports = router 
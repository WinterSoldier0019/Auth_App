const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("./config/passport")
const cors = require("cors")
const { User } = require("./models/user")
const uri = "mongodb+srv://Wintersoldier0019:<password>@cluster0-rqjg2.gcp.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true})
const App = express()

App.set("view engine", "ejs")
App.use(cors())
App.use(express.json())
App.use(express.urlencoded({extended: true}))
App.use("/",express.static(__dirname + "/public"))
App.use(session({
    secret: "drftgyhujnmkijhvgtfgyhjnmkkoijnbhgvt",
    saveUninitialized: false,
    resave: true
}))
App.use(passport.initialize())
App.use(passport.session())

App.get("/signup", (req,res) => {
    res.render("signup")
})

App.get("/login", (req,res) => {
    res.render("login")
})

App.post("/signup", (req,res) => {
    bcrypt.hash(req.body.password, 16, (err,hash) => {
        const user = {
            Username: req.body.username,
            Password: hash
        }
        User.create(user, (err,result) => {
            if(err) {
                res.status(400).send(err)
                console.log(err)
            }
            else {
                res.status(200).send(result)
                console.log("User created")
            }
        })
    })
})

App.post("/login",passport.authenticate("local", {
    failureRedirect: "/signup",
    successRedirect: "/profile"
}))

App.get("/profile", (req,res) => {
    if(req.user) {
        console.log("User Logged In")
        res.send(req.user)
    }
    else {
        res.redirect("/login")
    }
})

App.get("/see", (req,res) => {
    User.find().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

App.listen(9910, () => {
    console.log("Server listening on http://localhost:9910")
})

const passport = require("passport")
const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")

const { User } = require("../models/user")

passport.use(new localStrategy(async(username,password,done) => {
    try {
        const user = await User.findOne({Username: username})
        if(!user) {
            return done(null,false,{message: "No Such User Exists"})
        }
        else {
            bcrypt.compare(password,user.Password,(err,result,done) => {
                if(result === false) {
                    return done(err,false,{message: "Password do not match"})
                }
            })
        }
        return done(null,user)
    }
    catch (err) {
        console.log(err)
        return done(err)
    }
}))

passport.serializeUser((user,done) => {
    console.log(user)
    done(null,user.Username)
})
passport.deserializeUser((username,done) => {
    User.findOne({
        Username: username
    }).then((user) => {
        done(null,user)
    }).catch(done)
})

module.exports = passport
const mongoose = require("mongoose")

const User_Schema = new mongoose.Schema({
    Username: {
        type: String,
        index: true
    },
    Password: String
})

const User = mongoose.model("User", User_Schema)

module.exports = { User }

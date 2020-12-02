const express = require('express')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const Joke = require("./models/Joke")

dotenv.config()

mongoose.set("useFindAndModify", false)

app.use("/public",express.static('public'))
app.use(bodyparser.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('jokes.ejs');
})

app.post('/', async (req, res) => {

    const oneJoke = new Joke({
        content: req.body.content
    })
    
    try{
        await oneJoke.save()
        res.redirect('/')
    } catch (err) {
        res.redirect('/')
    }
})

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true ,useUnifiedTopology: true}, () => {
    console.log("Connected to db!");
    
    app.listen(3000, () => console.log("Server Up and running"));
});
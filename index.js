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

//READ

app.get('/', (req, res) => {

    Joke.find({}, (err, jokes) => {
        res.render('jokes.ejs', {jokeList: jokes})
    })
})

//CREATE

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

//UPDATE 

app.route("/edit/:id").get((req,res) => {

        const id = req.params.id;

        Joke.find({}, (err, jokes) => {
            res.render("jokeEdit.ejs", {jokeList: jokes, idJoke: id});

        })
    })
    .post((req, res) => {
        const id = req.params.id;

        Joke.findByIdAndUpdate(id, {content: req.body.content}, err => {
            if(err) return res.send(500, err);
            res.redirect("/");
        })
    })

//DELETE

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;

    Joke.findByIdAndRemove(id, err => {
        if(err) return res.status(status).send(500, err);
        res.redirect("/")
    })
})


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true ,useUnifiedTopology: true}, () => {
    console.log("Connected to db!");
    
    app.listen(3000, () => console.log("Server Up and running"));
});
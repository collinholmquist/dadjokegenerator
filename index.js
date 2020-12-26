const express = require('express')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const Joke = require("./models/Joke")

const axios = require('axios')

dotenv.config()

mongoose.set("useFindAndModify", false)

app.use("/public",express.static('public'))
app.use(bodyparser.urlencoded({extended: true}))
app.set("view engine", "ejs")

//Handle Random Dad Joke

const getJokes = async () => {
    try {
       return await axios.get('https://icanhazdadjoke.com/', {
       headers: {
        'Accept': 'application/json'
       }})
        
    } catch(error) {
        console.error(error)
    }
}

//READ

app.get('/', (req, res) => {

    Joke.find({}, (err, jokes) => {
        res.render('jokes.ejs', {jokeList: jokes})
    })

})

//CREATE

app.post('/', async (req, res) => {

    //if req.body.content is empty, create a new joke by randomly grabbing one from the API. 
    try{
    
        const oneJoke = new Joke({})

        if(typeof req.body.content !== 'undefined') {
                oneJoke.content =  req.body.content
        } else{
            const randomJoke = await getJokes();
            oneJoke.content = randomJoke.data.joke
        }

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
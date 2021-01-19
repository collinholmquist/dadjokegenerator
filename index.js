const express = require('express')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const Joke = require("./models/Joke")

const axios = require('axios')

dotenv.config()

mongoose.set("useFindAndModify", false)
const port = process.env.PORT || 3000;

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

const searchJokes = async (phrase) => {

    try{
        return await axios.get('https://icanhazdadjoke.com/search?term=' + phrase, {
            headers: {
                'Accept': 'application/json'

            }})
    } catch(error) {
        console.error(error)
    }   
}

//READ - render all Jokes from db
app.get('/', (req, res) => {

    Joke.find({}, (err, jokes) => {
        res.render('jokes.ejs', {jokeList: jokes})
    })

})

//CREATE - create
app.post('/', async (req, res) => {

    //console.log(req.body.content, 'from /')

    try{
        const oneJoke = new Joke({})
        oneJoke.content = req.body.content
        await oneJoke.save()
        res.redirect('/')
    } catch (err) {
        res.redirect('/')
    }
})

app.post('/search', async(req, res) =>{

    //console.log(req.body.content,' from /search')
    //console.log(typeof req.body.content)
    try{
        const oneJoke = new Joke({})
        
        if(req.body.content === '') {
                //console.log('we are getting a random joke')
                const randomJoke = await getJokes();
                oneJoke.content = randomJoke.data.joke
        } else {
                const searchedJoke = await searchJokes(req.body.content)
                //console.log(searchedJoke.data)
                oneJoke.content = searchedJoke.data.results[Math.floor(Math.random() * searchedJoke.data.results.length)].joke
        
        }
        await oneJoke.save()
        res.redirect('/')

    } catch(err) {
        res.redirect('/')
    }
        
})

//UPDATE 

app.route("/edit/:id")
    .get((req,res) => {

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

app.route("/remove/:id")
    
.get((req, res) => {
    const id = req.params.id;

    Joke.findByIdAndRemove(id, err => {
        if(err) return res.status(status).send(500, err);
        res.redirect("/")
    })
})

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true ,useUnifiedTopology: true});
app.listen(port, () => console.log("Server Up and running"));
const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use("/public",express.static('public'))
app.use(bodyparser.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('jokes.ejs');
})

app.post('/', (req, res) => {
    console.log(req.body)
})

app.listen(3000, ()=> {
    console.log("Server up and running")
})
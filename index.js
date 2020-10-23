const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors())

const port = 5000


const USER_NAME = process.env.DB_USER;
const USER_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${USER_NAME}:${USER_PASS}@cluster0.sfno3.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const Eventscollection = client.db(DB_NAME).collection("events");
    const usersCollection = client.db(DB_NAME).collection("users");
    console.log('Database Connected')
    // perform actions on the collection object
    // client.close();
    app.post('/addEvents', (req, res) => {
        const events = req.body;
        Eventscollection.insertOne(events)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addUsers', (req, res) => {
        const user = req.body;
        usersCollection.insertOne(user)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/events', (req, res) => {
        Eventscollection.find({})
            .toArray((error, document) => {
                res.send(document)
            })
    })

    app.get("/event/:id", (req, res) => {
        Eventscollection.find({ id: req.params._id })
            .toArray((error, documents) => {
                res.send(documents[0])
            })
    })



});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)
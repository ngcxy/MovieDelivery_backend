const express = require('express');
const fs = require('fs');
const PORT = 3000;
const app = express();
const app_amc = express();
const { MongoClient, ObjectId} = require("mongodb");


// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

class SourceMongo {
    constructor(){

        const url = 'mongodb+srv://cluster0.85u9pp0.mongodb.net/';
        const dbName = '@cluster0.85u9pp0.mongodb.net';
        const client = new MongoClient(url, { useUnifiedTopology: true });
        client.connect()
            .then(() => {
                console.log('Connected to the database');
            })
            .catch(err => console.error('Error connecting to the database:', err));
        const database = client.db("ee547_final");
        this._db = database;
        const user = database.collection("user");
        const movie = database.collection("movie");
    }
}

const db = new SourceMongo();

app.get('/ping', (req, res) => {
    res.status(204).send();
})

app.get('/movies/', (req, res) => {
    res.status(204).send();
})

app.get('/movie/', (req, res) => {
    res.status(204).send();
})

app.listen(PORT);
console.log(` server started -- port:${PORT}`);

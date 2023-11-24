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
        this.config = {
            "host":"localhost",
            "port":"27017",
            "db":"ee547_final",
            "opts":{
                "useUnifiedTopology":true
            }
        }

        const uri = `mongodb://${this.config.host}:${this.config.port}`;
        const client = new MongoClient(uri, this.config.opts);
        try {
            const database = client.db("ee547_final");
            this._db = database;
            const user = database.collection("user");
            const movie = database.collection("movie");
        } catch (err) {
            process.exit(5);
        }
    };
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

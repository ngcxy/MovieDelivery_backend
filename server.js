const express = require('express');
const cors = require('cors');
const fs = require('fs');
const PORT = 4000;
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const {TmdbApi} = require(`${__dirname}/api/tmdbApi.js`);

// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(cors());

class SourceMongo {
    constructor(){
        this.tmdb = new TmdbApi;
        const url = 'mongodb+srv://caixinyi:hXzSEPswekRuFsBM@cluster0.85u9pp0.mongodb.net/?retryWrites=true&w=majority';
        const dbName = '@cluster0.85u9pp0.mongodb.net';
        const client = new MongoClient(url, { useUnifiedTopology: true });
        client.connect()
            .then(() => {
                console.log('Connected to the database');
            })
            .catch(err => console.error('Error connecting to the database:', err));
        const database = client.db("547final");
        this._db = database;
        this.users = database.collection("user");
        this.movies = database.collection("movie");
        this.list = database.collection("list");
    }

    async getAllMovies() {
        let movies = await this.movies.find().toArray();
        console.log("Called: get all movies");
        return movies;
    }

    async getMovie(id) {
        let movie = await this.movies.find({mid:id}).toArray();
        if (movie) {
            console.log("Called: get movie id: ", id);
            return this.tmdb.getMovieDetail(id)
        }
    }

    async addMovie(id) {
        const movie = await this.tmdb.getMovieDetail(id);
        const timestamp = new Date();
        if (movie) {
            await this.movies.insertOne({
                mid:id,
                title: movie.title,
                poster_url: movie.poster_path,
                create_time: timestamp,
                listed:0,
                liked:0
            });
            console.log("Called: add movie id: ", id);
        }
        return movie;
    }

    async deleteMovie(id) {
        let movie = await this.movies.find({"_id":ObjectId(id)}).toArray();
        if (movie.length>0){
            await this.movies.deleteOne({"_id":ObjectId(id)});
            console.log("Called: delete movie id: ", id);
            return true;
        }
        return false;
    }
}

const db = new SourceMongo();
const tmdb = new TmdbApi();

app.get('/ping', (req, res) => {
    res.status(204).send();
})

app.get('/movies/', async (req, res) => {
    const m = await db.getAllMovies();
    res.status(200).send(m);
})

app.get('/movie/:mid', async (req, res) => {
    const m = await db.getMovie(req.params.mid);
    res.status(200).send(m);
})

app.post('/movie/:mid', async (req, res) => {
    const m = await db.addMovie(req.params.mid);
    console.log("add movie id: ", req.params.mid);
    res.status(200).send(m);
})

app.delete('/api/player/:mid', async (req,res) => {
    if (await db.deleteMovie(req.params.mid)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.listen(PORT);
console.log(` server started -- port:${PORT}`);

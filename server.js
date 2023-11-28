const express = require('express');
const cors = require('cors');
const PORT = 4000;
const app = express();


const {SourceMongo} = require(`${__dirname}/sourceMongo.js`);

// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(cors());

const db = new SourceMongo();

app.get('/ping', (req, res) => {
    res.status(204).send();
})

app.get('/movies/', async (req, res) => {
    const m = await db.getAllMovies();
    res.status(200).send(m);
})

app.get('/movie/:_id', async (req, res) => {
    const m = await db.getMovie(req.params._id);
    res.status(200).send(m);
})

app.get('/movie/rating/:_id', async (req, res) => {
    const r = await db.getMovieRating(req.params._id);
    res.status(200).send(r);
})

app.post('/movie/:tmid', async (req, res) => {
    const m = await db.addMovie(req.params.tmid);
    console.log("add movie id: ", req.params.tmid);
    res.status(200).send(m);
})

app.delete('/api/player/:tmid', async (req,res) => {
    if (await db.deleteMovie(req.params.tmid)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.listen(PORT);
console.log(` server started -- port:${PORT}`);

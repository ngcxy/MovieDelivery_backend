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

app.get('/movie/provider/:_id', async (req, res) => {
    const p = await db.getMovieProvider(req.params._id);
    res.status(200).send(p);
})

app.get('/movie/video/:_id', async (req, res) => {

})

app.get('/movie/reviews/:_id', async (req, res) => {

})

app.get('/post', async (req, res) => {

})


// user operation

app.post('/list/:uid', async (req, res) => {
    // add a movie into user's list
    // include mongodb _id of the movie as req.query[_id]
})

app.get('/list/:uid', async (req, res) => {
    // get all movies in user's list
})

app.delete('/list/:uid', async (req, res) => {
    //delete a movie from user's list
    // include mongodb _id of the movie as req.query[_id]
})

app.post('/movie/like/:_id', async (req, res) => {
// include mongodb user's _id as req.query[uid]
})

app.post('/movie/reviews/:_id', async (req, res) => {

})

app.post('/post/:uid', async (req, res) => {

})

app.delete('/post/:uid', async (req, res) => {

})

app.post('/recommend/:uid', async (req, res) => {

})

// admin movie management
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

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const app = express();

const {SourceMongo} = require(`${__dirname}/sourceMongo.js`);

// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());

const db = new SourceMongo();

app.get('/ping', (req, res) => {
    res.status(204).send();
})
app.get('/movies/', async (req, res) => {
    try {
        const m = await db.getAllMovies();
        res.status(200).send(m);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get('/movies/search', async (req, res) => {
    try {
        const result = await db.searchMovie(req.query.q);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }

})
app.get('/movies/:_id', async (req, res) => {
    try {
        const m = await db.getMovie(req.params._id);
        res.status(200).send(m);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get('/movies/:_id/ratings', async (req, res) => {
    try {
        const r = await db.getMovieRating(req.params._id);
        res.status(200).send(r);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get('/movies/:_id/providers', async (req, res) => {
    try {
        const p = await db.getMovieProvider(req.params._id);
        res.status(200).send(p);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get('/movies/:_id/videos', async (req, res) => {
    try {
        const v = await db.getMovieVideo(req.params._id);
        res.status(200).send(v);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get('/movies/:_id/reviews', async (req, res) => {

})
app.get('/posts', async (req, res) => {

})


// user operation

app.post('/users', async (req, res) => {
    console.log(req.body);
    try{
        const user = await db.updateUser(req.body);
        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.get('/users/:uid', async (req, res) => {
    try{
        const user = await db.getUserByGoogleId(req.params.uid);
        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.get('/users/:uid/list', async (req, res) => {
    try{
        const movies = await db.getUserListMovie(req.params.uid);
        if (movies) {
            res.status(200).send(movies);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post('/users/:uid/list', async (req, res) => {
    try {
        await db.addUserList(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie added to list');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.delete('/users/:uid/list', async (req, res) => {
    try {
        await db.removeUserList(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie removed from list');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post('/users/:uid/like', async (req, res) => {
    try {
        await db.addUserLike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie added to like');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.delete('/users/:uid/like', async (req, res) => {
    try {
        await db.removeUserLike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie removed from like');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post('/users/:uid/dislike', async (req, res) => {
    try {
        await db.addUserDislike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie added to dislike');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.delete('/users/:uid/dislike', async (req, res) => {
    try {
        await db.removeUserDislike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie removed from dislike');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post('/movie/reviews/:_id', async (req, res) => {

})
app.post('/recommend/:uid', async (req, res) => {

})

// admin movie management
app.post('/movie/:tmid', async (req, res) => {
    const m = await db.addMovie(req.params.tmid);
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

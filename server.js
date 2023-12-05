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
app.get('/movies/search', async (req, res) => {
    const result = await db.searchMovie(req.query.q);
    res.status(200).send(result);
})
app.get('/movies/:_id', async (req, res) => {
    const m = await db.getMovie(req.params._id);
    res.status(200).send(m);
})
app.get('/movies/:_id/ratings', async (req, res) => {
    const r = await db.getMovieRating(req.params._id);
    res.status(200).send(r);
})
app.get('/movies/:_id/providers', async (req, res) => {
    const p = await db.getMovieProvider(req.params._id);
    res.status(200).send(p);
})
app.get('/movies/:_id/videos', async (req, res) => {
    const v = await db.getMovieVideo(req.params._id);
    res.status(200).send(v);
})
app.get('/movies/:_id/reviews', async (req, res) => {

})
app.get('/posts', async (req, res) => {

})


// user operation

app.post('/users/:uid', async (req, res) => {
    // get all movies in user's list
})

app.post('/list/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const movie = new Movie(req.body); 
        await movie.save(); 

        await User.findByIdAndUpdate(userId, { $addToSet: { movies: movie._id } });
        res.status(200).send('Movie added to list');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.get('/list/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId).populate('movies');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user.movies);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.delete('/list/:uid', async (req, res) => {
    //delete a movie from user's list
    // include mongodb _id of the movie as req.query[_id]
    try {
        const userId = req.params.uid;
        const movieId = req.query._id; 

        await User.findByIdAndUpdate(userId, { $pull: { movies: movieId } });
        res.status(200).send('Movie removed from list');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post('/movie/like/:_id', async (req, res) => {
// include mongodb user's _id as req.query[uid]
    try {
        const movieId = req.params._id;
        const userId = req.query.uid; 

        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).send('User not found');
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        if (movie.likedBy && movie.likedBy.includes(userId)) {
            return res.status(400).send('User already liked this movie');
        }

        const update = {
            $inc: { likes: 1 },
            $push: { likedBy: userId }
        };
        await Movie.findByIdAndUpdate(movieId, update, { new: true, upsert: true });

        res.status(200).send('Movie liked');
    } catch (error) {
        res.status(500).send(error.message);
    }
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

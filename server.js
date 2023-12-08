const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const app = express();

const {SourceMongo} = require(`${__dirname}/sourceMongo.js`);
const { config } = require(`${__dirname}/config.js`)

console.log(config);

// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());

const db = new SourceMongo();

app.get(`${config.apiUrl}/ping`, (req, res) => {
    res.status(204).send();
})
app.get(`${config.apiUrl}/movies/`, async (req, res) => {
    try {
        const m = await db.getAllMovies();
        res.status(200).send(m);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get(`${config.apiUrl}/movies/search`, async (req, res) => {
    try {
        const result = await db.searchMovie(req.query.q);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }

})
app.get(`${config.apiUrl}/movies/:_id`, async (req, res) => {
    try {
        const m = await db.getMovie(req.params._id);
        res.status(200).send(m);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get(`${config.apiUrl}/movies/:_id/ratings`, async (req, res) => {
    try {
        const r = await db.getMovieRating(req.params._id);
        res.status(200).send(r);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get(`${config.apiUrl}/movies/:_id/providers`, async (req, res) => {
    try {
        const p = await db.getMovieProvider(req.params._id);
        res.status(200).send(p);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get(`${config.apiUrl}/movies/:_id/videos`, async (req, res) => {
    try {
        const v = await db.getMovieVideo(req.params._id);
        res.status(200).send(v);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post(`${config.apiUrl}/movies/:_id/reviews`, async (req, res) => {
    try {
        const movieId = req.params._id;
        const reviewData = req.body.review;
        const userId = req.body.uid;
        const userName = req.body.name;
        console.log("111", movieId, userId, reviewData)

        const newReview = await db.addReview(movieId, userId, userName, reviewData);

        res.status(201).send(newReview);
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get(`${config.apiUrl}/movies/:_id/reviews`, async (req, res) => {
    try {
        const movieId = req.params._id;
        const reviews = await db.getReview(movieId);
        console.log(reviews);

        // if (reviews.length === 0) {
        //     return res.status(404).json({ message: "No reviews found for this movie." });
        // }

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Internal server error.');
    }
})
app.delete(`${config.apiUrl}/reviews/:rid`, async (req, res) => {
    try {
        const reviewId = req.params.rid;

        const result = await db.deleteReview(reviewId);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Internal server error');
    }
})


// user operation
app.get(`${config.apiUrl}/users/:uid`, async (req, res) => {
    try{
        const user = await db.getUserByGoogleId(req.params.uid);
        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.get(`${config.apiUrl}/users/:uid/list`, async (req, res) => {
    try{
        const movies = await db.getUserListMovie(req.params.uid);
        if (movies) {
            res.status(200).send(movies);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post(`${config.apiUrl}/users/:uid/list`, async (req, res) => {
    try {
        await db.addUserList(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie added to list');
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.delete(`${config.apiUrl}/users/:uid/list`, async (req, res) => {
    try {
        await db.removeUserList(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie removed from list');
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post(`${config.apiUrl}/users/:uid/like`, async (req, res) => {
    try {
        await db.addUserLike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie added to like');
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.delete(`${config.apiUrl}/users/:uid/like`, async (req, res) => {
    try {
        await db.removeUserLike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie removed from like');
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post(`${config.apiUrl}/users/:uid/dislike`, async (req, res) => {
    try {
        await db.addUserDislike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie added to dislike');
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.delete(`${config.apiUrl}/users/:uid/dislike`, async (req, res) => {
    try {
        await db.removeUserDislike(req.params.uid, req.body.mid);    // movie id passed as req.body
        res.status(200).send('Movie removed from dislike');
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post(`${config.apiUrl}/recommend/:uid`, async (req, res) => {

})

// admin movie/user management
app.post(`${config.apiUrl}/users`, async (req, res) => {
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
app.post(`${config.apiUrl}/movies/:tmid`, async (req, res) => {
    const m = await db.addMovie(req.params.tmid);
    res.status(200).send(m);
})
app.delete(`${config.apiUrl}/api/movies/:tmid`, async (req,res) => {
    if (await db.deleteMovie(req.params.tmid)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.listen(PORT);
console.log(` server started -- port:${PORT}`);

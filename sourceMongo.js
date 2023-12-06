const { MongoClient, ObjectId } = require("mongodb");

const {TmdbApi} = require(`${__dirname}/api/tmdbApi.js`);
const {OmdbApi} = require(`${__dirname}/api/omdbApi.js`)
const cors = require("cors");

// app.set('view engine', 'ejs');
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

class SourceMongo {
    constructor(){
        this.tmdb = new TmdbApi;
        this.omdb = new OmdbApi;

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
        // this.list = database.collection("list");
    }

    async getAllMovies() {
        let movies = await this.movies.find().toArray();
        console.log("Called: get all movies");
        return movies;
    }

    async getMovie(_id) {
        let movie = await this.movies.findOne({_id:new ObjectId(_id)});
        if (movie) {
            const tmid = movie.tmid;
            console.log("Called: get movie detail, _id: ", _id);
            return this.tmdb.getMovieDetail(tmid)
        }
    }

    async searchMovie(query) {
        let pipeline = [
            {
                $search: {
                    index: "searchTitle",
                    text: {
                        query: query,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }
        ];
        return this.movies.aggregate(pipeline).toArray();
    }

    async getMovieRating(_id) {
        let movie= await this.getMovie(_id);
        if (movie) {
            console.log("Called: get movie rating, _id: ", _id);
            return this.omdb.getMovieRating(movie.imdb_id);
        }
    }

    async getMovieProvider(_id) {
        let movie = await this.movies.findOne({_id:new ObjectId(_id)});
        if (movie) {
            const tmid = movie.tmid;
            console.log("Called: get movie provider, _id: ", _id);
            return this.tmdb.getMovieProvider(tmid)
        }
    }

    async getMovieVideo(_id) {
        let movie = await this.movies.findOne({_id:new ObjectId(_id)});
        if (movie) {
            const tmid = movie.tmid;
            console.log("Called: get movie videos, _id: ", _id);
            return this.tmdb.getMovieVideo(tmid)
        }
    }

    async addMovie(id) {
        let timestamp = new Date();
        const movie = await this.tmdb.getMovieDetail(id);
        if (movie) {
            const release_date = movie.release_date;
            await this.movies.insertOne({
                create_time: timestamp,
                tmid:id,
                title: movie.title,
                year: release_date.slice(0,4),
                genres: movie.genres.map(genres => genres.name),
                poster_url: movie.poster_path,
                like:0,
                dislike:0,
                last_mentioned: null,
                review: []
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

    async getUserById(_id) {
        let user = await this.users.findOne({_id:new ObjectId(_id)});
        if (user) {
            // const email = user.email;
            console.log("Called: get user, _id: ", _id);
            return user;
        }
    }

    async getUserByEmail(email) {
        let user = await this.users.findOne({email:email});
        if (user) {
            console.log("Called: get user, email: ", email);
            return user;
        }
    }

<<<<<<< HEAD
    async addUser(email,name) {
        let timestamp = new Date();

        const newUser = {
            email: email,
            name: name,
=======
    async addUser(info) {
        let timestamp = new Date();
        const newUser = {
            email: info.email,
            name: info.name,
>>>>>>> 0674f6de12a8b735e554bcf128c51b5098b0890a
            list: [],
            like: [],
            dislike: [],
            created_at: timestamp
        };

        try {
            const result = await this.users.insertOne(newUser);
            console.log("Called: add user", result.insertedId);
<<<<<<< HEAD
            return result.insertedId; 
        } catch (error) {
                console.error('Error adding new user:', error);
                throw error; 
        }
=======
            return result.insertedId;
        } catch (error) {
            console.error('Error adding new user:', error);
            throw error;
        }
    }

    async addUserList(uid, mid) {
        await this.users.updateOne(uid, { $addToSet: { list_movie: mid } })
        console.log("Called: add movie to user's list");
    }

    async removeUserList(uid, mid) {
        await this.users.updateOne(uid, { $pull: { list_movie: mid } })
        console.log("Called: remove movie to user's list");
    }

    async addUserLike(uid, mid) {
        await this.users.updateOne(uid, { $addToSet: { like: mid } })
        console.log("Called: add movie to user like");
    }

    async removeUserLike(uid, mid) {
        await this.users.updateOne(uid, { $pull: { like: mid } })
        console.log("Called: remove movie to user like");
    }

    async addUserDislike(uid, mid) {
        await this.users.updateOne(uid, { $addToSet: { dislike: mid } })
        console.log("Called: add movie to user dislike");
    }

    async removeUserDislike(uid, mid) {
        await this.users.updateOne(uid, { $pull: { dislike: mid } })
        console.log("Called: remove movie to user dislike");
>>>>>>> 0674f6de12a8b735e554bcf128c51b5098b0890a
    }
}

exports.SourceMongo = SourceMongo;
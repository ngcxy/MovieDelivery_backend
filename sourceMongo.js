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
        let movie = await this.movies.findOne({_id:new ObjectId(_id)});
        let rating = movie.like/(movie.dislike+movie.like) * 100;
        rating = `${rating.toFixed(0)}%`;
        movie= await this.getMovie(_id);
        if (movie) {
            console.log("Called: get movie rating, _id: ", _id);
            return {
                local: rating,
                ...await this.omdb.getMovieRating(movie.imdb_id)
            };
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
            console.log("Called: get user, _id: ", _id);
            return user;
        }
    }

    async getUserByGoogleId(gid) {
        let user = await this.users.findOne({google_id: gid});
        if (user) {
            console.log("Called: get user, google_id: ", gid);
            return user;
        }
    }

    async updateUser(info) {
        let timestamp = new Date();
        const newUser = {
            google_id: info.id,
            email: info.email,
            name: info.name,
            list: [],
            like: [],
            dislike: [],
            created_at: timestamp
        };

        try {
            let result = await this.users.findOne({google_id: info.id});
            if (!result) {
                result = await this.users.insertOne(newUser);
                console.log("Called: add user", result.insertedId);
            }
            return newUser.google_id;
        } catch (error) {
            console.error('Error adding new user:', error);
            throw error;
        }
    }

    async getUserListMovie(uid) {
        const user = await this.users.findOne({google_id: uid});
        const movieIds = user.list_movie.map(id => new ObjectId(id));
        const movies = await this.movies.find({_id: { $in: movieIds} }).toArray();
        console.log("Called: get movies in user's list");
        return movies;
    }

    async addUserList(uid, mid) {
        await this.users.updateOne({google_id: uid},{$push: {list_movie: mid}});
        console.log("Called: add movie to user's list");
    }

    async removeUserList(uid, mid) {
        await this.users.updateOne({$and: [{ google_id: uid }, { list_movie:{$in:[mid]}}]}, {$pull: { list_movie: mid }});
        console.log("Called: remove movie from user's list");
    }

    async addUserLike(uid, mid) {
        await this.users.updateOne({google_id: uid},{$push: {like: mid}});
        await this.movies.updateOne({_id: new ObjectId(mid)}, {$inc: {like: 1}});
        console.log("Called: add movie to user like");
    }

    async removeUserLike(uid, mid) {
        await this.users.updateOne({$and: [{ google_id: uid }, { like:{$in:[mid]}}]}, {$pull: { like: mid }});
        await this.movies.updateOne({_id: new ObjectId(mid)}, {$inc: {like: -1}});
        console.log("Called: remove movie from user like");
    }

    async addUserDislike(uid, mid) {
        await this.users.updateOne({google_id: uid},{$push: {dislike: mid}});
        await this.movies.updateOne({_id: new ObjectId(mid)}, {$inc: {dislike: 1}});
        console.log("Called: add movie to user dislike");
    }

    async removeUserDislike(uid, mid) {
        await this.users.updateOne({$and: [{ google_id: uid }, { dislike:{$in:[mid]}}]}, {$pull: { dislike: mid }});
        await this.movies.updateOne({_id: new ObjectId(mid)}, {$inc: {dislike: -1}});
        console.log("Called: remove movie from user dislike");
    }

    async getReview(_id) {
        return this._db.collection('reviews').find({ movie_id: new ObjectId(_id) }).sort({ created_at: -1 }).toArray();
    }

    async addReview(mid, uid, username, reviewData) {
        try {
            const newReview = {
                movie_id: new ObjectId(mid),
                user_google_id: uid,
                user_name: username,
                content: reviewData,
                created_at: new Date()
            };
            const result = await this._db.collection('reviews').insertOne(newReview);
            return result[0];
        } catch (error) {
            console.error('Error adding new review:', error);
            throw error;
        }
    }

    async updateReview(rid, updateData) {
        try {
            const result = await this._db.collection('reviews').updateOne(
                { _id: new ObjectId(rid) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                throw new Error('No review found with the given ID');
            }

            return { updated: true, id: rid };
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }
    async deleteReview(rid) {
        try {
            const result = await this._db.collection('reviews').deleteOne(
                { _id: new ObjectId(rid) }
            );

            if (result.deletedCount === 0) {
                throw new Error('No review found with the given ID');
            }

            return { deleted: true, id: rid };
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    async addReco(content) {
        try {
            const newReco = {
                content: content,
                created_at: new Date()
            };
            const result = await this._db.collection('recommendation').insertOne(newReco);
            return result[0];
        } catch (error) {
            console.error('Error adding new recommendation:', error);
            throw error;
        }
    }

    async deleteReco(rid) {
        try {
            const result = await this._db.collection('recommendation').deleteOne(
                { _id: new ObjectId(rid) }
            );

            if (result.deletedCount === 0) {
                throw new Error('No recommendation found with the given ID');
            }

            return { deleted: true, id: rid };
        } catch (error) {
            console.error('Error deleting recommendation:', error);
            throw error;
        }
    }

}

exports.SourceMongo = SourceMongo;
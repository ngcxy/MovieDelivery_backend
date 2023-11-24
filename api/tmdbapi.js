const axios = require('axios');

class TmdbApi {
    constructor() {
        const apiKey = 'cyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GpDRfWO52b5yG_I677xxhAfzQbnU8a2PzQIlOmAFtws';
        this.api = axios.create({
            baseURL: 'https://api.themoviedb.org/3/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });
    }

    getMovieDetail(id) {
        this.api
            .get(`movie/${id}`)
            .catch(err =>
                console.log(err)
            )
            .then(res => {
                return(res.data);
            })
    }

    getMovieRate(id, callback) {

    }

    getMovieReview(id, callback) {

    }

}
exports.TmdbApi = TmdbApi;

const axios = require('axios');

class TmdbApi {
    constructor() {
        const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzkyOTkzMzc1NDMxYzkyZDBiYWU2YWYwYmI0MDhmYiIsInN1YiI6IjY1NjA0NTExMzY3OWExMDk3NTI3ZGJmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GpDRfWO52b5yG_I677xxhAfzQbnU8a2PzQIlOmAFtws';
        this.api = axios.create({
            baseURL: 'https://api.themoviedb.org/3/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });
    }

    async getMovieDetail(id) {
        try {
            const res = await this.api.get(`movie/${id}`);
            return(res.data);
        } catch(err){
            console.log(err)
        }
    }



    async getMovieReview(id) {

    }

    async getMovieProvider(id) {

    }

}
exports.TmdbApi = TmdbApi;

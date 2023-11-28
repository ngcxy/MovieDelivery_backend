const axios = require('axios');

class OmdbAPI {

    async getMovieRating(id) {
        const info = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=305412f9`);
        const res = {
            rt: info.data.Ratings[1].Value,
            imdb: info.data.imdbRating
        }
        return res;
    }

}

exports.OmdbApi = OmdbAPI;
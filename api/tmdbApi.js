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

    async getMovieProvider(id) {
        try {
            const info = await this.api.get(`movie/${id}/watch/providers`);
            if (info.data.results.US){
                const res = info.data.results.US;
                return {
                    link: res.link,
                    provider: this.providerNormalize(res)
                };
            } else {
                return {}
            }
        } catch(err){
            console.log(err)
        }
    }

    // simplify the provider list:
    // rent and buy providers will both show as available
    // only retrieve providers with priority <= 20
    providerNormalize(res) {
        const result = [];
        const provider = new Set();

        for (let rent of res.rent) {
            if (rent.display_priority <= 20) {
                result.push({
                    provider_name: rent.provider_name,
                    logo_path: rent.logo_path
                });
                provider.add(rent.provider_name);
            }
        }
        for (let buy of res.buy) {
            if (buy.display_priority <= 20 && !provider.has(buy.provider_name)) {
                result.push({
                    provider_name: buy.provider_name,
                    logo_path: buy.logo_path
                });
                provider.add(buy.provider_name);
            }
        }
        return result;
    }

    async getMovieVideo(id) {
        try {
            const info = await this.api.get(`movie/${id}/videos`);
            const res = info.data.results.filter(r => r.site === "YouTube").map(r => r.key);
            return res[0];
        } catch(err){
            console.log(err)
        }
    }

    async getMovieReview(id) {

    }

}
exports.TmdbApi = TmdbApi;

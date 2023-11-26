'use strict';
const {TmdbApi} = require(`${__dirname}/api/tmdbApi.js`);
//import other api to test

const { axios } = require('axios');

async function test_tmdb(){
    const tmdb = new TmdbApi;
    return await tmdb.getMovieDetail('670292');
}

test_tmdb().then(r => console.log(r));


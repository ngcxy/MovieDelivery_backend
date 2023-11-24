'use strict';
const {TmdbApi} = require(`${__dirname}/tmdbapi.js`);
//import other api to test

const { axios } = require('axios');

const tmdb = new TmdbApi();
tmdb.getMovieDetail('670292', (data)=>{
    return(data);
});


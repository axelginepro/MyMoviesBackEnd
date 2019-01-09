const router = require('express').Router();
const mongoose = require('mongoose')
const request = require('request');

const apiKey = "

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
};
mongoose.connect('mongodb://user:password@ds063158.mlab.com:63158/mymoviezapp', options, error => {
  if (error) {
    console.error(error);
  } else {
    console.log('server is running on movieappz db');
  }
});

const movieSchema = mongoose.Schema(
  {
    title: String, 
    release: String,
    overview: String, 
    poster_path: String,
    idMovieDB: Number
  });
const MovieModel = mongoose.model('movies', movieSchema);



router.get('/movies', function(req, res, next) {
  request(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&page=1&sort_by=popularity.desc&include_adult=false&include_video=false`, (error, response, body) => {
    body = JSON.parse(body);
    res.json({result: true, movieList: body.results});
  });
});


router.get('/mymovies', (req, res, next) => {
  MovieModel.find(function(error, movies) {
    res.json({result: true, movies});
  });
});


router.post('/mymovies', (req, res) => {
  var newMovie = new MovieModel({
    title: req.body.title,
    release: req.body.release_date,
    overview: req.body.overview,
    poster_path: req.body.poster_path,
    idMovieDB: req.body.idMovieDB
  });
  newMovie.save(function(error, movie) {
    res.json({result: true, movie});
  });
});


router.delete('/mymovies/:movieId', (req, res) => {
  MovieModel.deleteOne({
    idMovieDB: req.params.movieId
  }, function(error, response) {
    res.json({result: true});
  });
});

module.exports = router;

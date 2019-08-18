//Require necessary packages, files and modules
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;


app.use(express.static('public'));
app.use(morgan('common'));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Connect Mongoose to the database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true});

//GET REQUESTS
//Get all movies
app.get('/movies', function(req, res) {
  Movies.find()
  .then(function(movies) {
    res.json(movies);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

//Get a movie by Title 
app.get('/movies/:Title', function(req, res) {
  Movies.findOne({ Title : req.params.Title})
  .then(function(movie) {
    res.json(movie);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Get genre info by Title 
app.get('/genres/:Title', function(req, res) {
  Movies.findOne({ "Genres.Title" : req.params.Title}) 
  .then(function(movie) {
    res.send(movie.Genres.Description);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// app.get('/directors/:name', function(req, res) {
//   res.send('Successful GET request returning data about a director by name');
// });
// app.get('/account/:id/favorite/movies', function(req, res) {
//   res.send('Successful GET request returning data about favorite movies of a user');
// });

// //POST requests 
// app.post('/account', function(req, res) {
//   res.send('Successful POST request allowing to register a user');
// });
// app.post('/account/:id/favorite/movies', function(req, res) {
//   res.send('Successful POST request adding a movie to the user\'s list of favorite movies');
// });

// //PUT requests
// app.put('/account/:id', function(req, res) {
//   res.send('Successful PUT request allowing the user to update profile information');
// });

// //DELETE requests
// app.delete('/account/:id/favorite/movies/:title', function(req, res) {
//   res.send('Successful DELETE request removing a movie from the user\'s list of favorite movies');
// });

// app.delete('/account/:id', function(req, res) {
//   res.send('Successful DELETE request removing the user\'s account');
// });

app.listen(8080);
//Require necessary packages, files and modules
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const auth = require('./auth')(app); //app argument ensures that Express is available also in auth.js file
const passport = require('passport');
require('./passport.js');

//Middleware functions
app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Connect Mongoose to the database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true
});

//GET REQUESTS

app.get('/', (req, res) => {
  return res.send("Kira's lovely little app");
});

//Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), function(
  req,
  res
) {
  Movies.find()
    .then(movies => res.json(movies))
    .catch(error => errorHandler(error, res));
});

//Get a movie by Title
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Movies.findOne({ Title: req.params.title })
      .then(movie => res.json(movie))
      .catch(error => errorHandler(error, res));
  }
);

//Get genre info by Title
app.get(
  '/genres/:title',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Movies.findOne({ 'Genre.Title': req.params.title })
      .then(movie => res.json(movie.Genre))
      .catch(error => errorHandler(error, res));
  }
);

//Get info about a director by name
app.get(
  '/directors/:name',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Movies.findOne({ 'Director.Name': req.params.name })
      .then(movie => res.json(movie.Director))
      .catch(error => errorHandler(error, res));
  }
);

//Get user by id
app.get(
  '/account/:id',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOne({ _id: req.params.id })
      .then(user => {
        if (!user) {
          res.status(404).send('User not found.');
        } else {
          res.status(201).json(user);
        }
      })
      .catch(error => errorHandler(error, res));
  }
);

//Get the list of the user's favorite movies
app.get(
  '/account/:id/favorite/movies',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOne({ _id: req.params.id })
      .then(user => res.status(201).json(user.FavoriteMovies))
      .catch(error => errorHandler(error, res));
  }
);

//POST REQUESTS
//Register a new user
app.post(
  '/account',
  [
    check('Username', 'Username should be longer than 4 characters.').isLength({
      min: 4
    }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required')
      .not()
      .isEmpty(),
    check('Email', 'Please enter a valid email address').isEmail()
  ],
  (req, res) => {
    //check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(user => {
        if (user) {
          res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(user => res.status(201).json(user))
            .catch(error => errorHandler(error, res));
        }
      })
      .catch(error => errorHandler(error, res));
  }
);

//Add a movie to the user's list of favourite movies
app.post(
  '/account/:id/favorite/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { FavoriteMovies: req.params.movieId } },
      { new: true }
    )
      .then(user => res.status(201).json(user))
      .catch(error => errorHandler(error, res));
  }
);

//PUT REQUESTS
//Allow the user to update profile information
app.put(
  '/account/:id',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username should be longer than 4 characters.').isLength({
      min: 4
    }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required')
      .not()
      .isEmpty(),
    check('Email', 'Please enter a valid email address').isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    )
      .then(user => res.status(201).json(user))
      .catch(error => errorHandler(error, res));
  }
);

// //DELETE REQUESTS
//Remove a movie from the user's list of favorite movies
app.delete(
  '/account/:id/favorite/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { FavoriteMovies: req.params.movieId } },
      { new: true }
    )
      .then(user => res.status(201).json(user))
      .catch(error => errorHandler(error, res));
  }
);

//Delete the user profile
app.delete(
  '/account/:id',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Users.findOneAndRemove({ _id: req.params.id })
      .then(user => {
        if (!user) {
          res.status(404).send('User not found.');
        } else {
          res
            .status(200)
            .send(`${user.Username} has been successfully deleted.`);
        }
      })
      .catch(error => errorHandler(error, res));
  }
);

function errorHandler(error, res) {
  console.error(error);
  res.status(500).send(`Error: ${error}`);
}

//Looks for a pre-configured port number; if nothing found - sets the port to 3000
let port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function() {
  console.log('Listening on Port 3000');
});

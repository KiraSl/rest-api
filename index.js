//Require necessary packages, files and modules
const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//Connect Mongoose to the database
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true
});

//GET REQUESTS
//Get all movies
app.get("/movies", function(req, res) {
  Movies.find()
    .then(function(movies) {
      res.json(movies);
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
});

//Get a movie by Title
app.get("/movies/:Title", function(req, res) {
  Movies.findOne({ Title: req.params.Title })
    .then(function(movie) {
      res.json(movie);
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
});

//Get genre info by Title
app.get("/genres/:Title", function(req, res) {
  Movies.findOne({ "Genre.Title": req.params.Title })
    .then(function(movie) {
      res.json(movie.Genre);
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
});

//Get info about a director by name
app.get("/directors/:Name", function(req, res) {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then(function(movie) {
      res.json(movie.Director);
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
});

//Get user by id
app.get("/account/:id", function(req, res) {
  Users.findOne({ _id: req.params.id })
    .then(function(user) {
      if (!user) {
        res.status(404).send("User not found.");
      } else {
        res.status(201).json(user);
      }
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
});

// app.get('/account/:id/favorite/movies', function(req, res) {
//   res.send('Successful GET request returning data about favorite movies of a user');
// });

//POST requests
//Register a new user
app.post("/account", function(req, res) {
  Users.findOne({ Username: req.body.Username })
    .then(function(user) {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then(function(user) {
            res.status(201).json(user);
          })
          .catch(function(error) {
            errorHandler(error, res);
          });
      }
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
});

// app.post('/account/:id/favorite/movies', function(req, res) {
//   res.send('Successful POST request adding a movie to the user\'s list of favorite movies');
// });

//PUT requests
app.put("/account/:id", function(req, res) {
  Users.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  )
    .then(function(user) {
      res.status(201).json(user);
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
  // res.send('Successful PUT request allowing the user to update profile information');
});

//Get users

// //DELETE requests
// app.delete('/account/:id/favorite/movies/:title', function(req, res) {
//   res.send('Successful DELETE request removing a movie from the user\'s list of favorite movies');
// });

app.delete("/account/:id", function(req, res) {
  Users.findOneAndRemove({ _id: req.params.id })
    .then(function(user) {
      if (!user) {
        res.status(404).send("User not found.");
      } else {
        res.status(200).send(`${user.Username} has been successfully deleted.`);
      }
    })
    .catch(function(error) {
      errorHandler(error, res);
    });
  //res.send('Successful DELETE request removing the user\'s account');
});

function errorHandler(error, res) {
  console.error(error);
  res.status(500).send(`Error: ${error}`);
}

app.listen(8080);

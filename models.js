const mongoose = require('mongoose');

//Define a schema for movies
let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true}, 
  Year: {type: String, required: true},
  Genres: [ 
    {
      Title: {type: String, required: true},
      Description: {type: String, required: true}
    }
  ],
  Directors: [
    {
      Name: {type: String, required: true},
      Born: {type: String, required: true},
      Death: String,
      Bio: String
    }
  ],
  ImageURL: String, 
  Featured: Boolean
});

//Define a schema for users
let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}
  ]
});

//Create models that use schemas defined above
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//Export models in order to be able to import them into "index.js" file
module.exports.Movie = Movie;
module.exports.User = User;
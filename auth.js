//Creates a new endpoint for registered users to log in.
//Authenticates login requests using basic HTTP authentication
//and generate a JWT for the user.

let jwtSecret = 'your_jwt_secret'; //same key as used in the JWTstrategy
let jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport'); //local passport file

function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d', //token will expire in 7 days
    algorithm: 'HS256' //algorithm used to "sign" or encode the values of the JWT
  });
}

//POST Login
module.exports = router => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, error => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

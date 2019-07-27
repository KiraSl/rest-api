const express = require('express'),
  morgan = require('morgan');
const app = express();

let oscarMovies = [ {
  title: 'Green Book',
  dateOfIssue: '2018',
  director: 'Peter Farrelly',
  genre: [
    'Biography', 
    'Comedy', 
    'Drama'
    ],
  description: 'A working-class Italian-American bouncer becomes the driver of an African-American classical pianist on a tour of venues through the 1960s American South.'
},
{
  title: 'The Shape of Water',
  dateOfIssue: '2017',
  director: 'Guillermo del Toro',
  genre: [
    'Adventure', 
    'Drama', 
    'Fantasy'
    ],
  description: 'At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity.'
},
{
  title: 'Moonlight',
  dateOfIssue: '2016',
  director: 'Barry Jenkins',
  genre: [
    'Drama'
    ],
  description: 'A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.'
},
{
  title: 'Spotlight',
  dateOfIssue: '2015',
  director: 'Tom McCarthy',
  genre: [
    'Biography', 
    'Crime', 
    'Drama'
    ],
  description: 'The true story of how the Boston Globe uncovered the massive scandal of child molestation and cover-up within the local Catholic Archdiocese, shaking the entire Catholic Church to its core.'
},
{
  title: 'Birdman',
  dateOfIssue: '2014',
  director: 'Alejandro G. Iñárritu',
  genre: [
    'Comedy', 
    'Drama'
    ],
  description: 'A washed-up superhero actor attempts to revive his fading career by writing, directing, and starring in a Broadway production.'
},
{
  title: '12 Years a Slave',
  dateOfIssue: '2013', 
  director: 'Steve McQueen',
  genre: [
    'Biography', 
    'Drama', 
    'History'
    ],
  description: 'In the antebellum United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery.'
},
{
  title: 'Argo',
  dateOfIssue: '2012',
  director: 'Ben Affleck',
  genre: [
    'Biography', 
    'Drama', 
    'Thriller'
    ],
  description: 'Acting under the cover of a Hollywood producer scouting a location for a science fiction film, a CIA agent launches a dangerous operation to rescue six Americans in Tehran during the U.S. hostage crisis in Iran in 1979.'
},
{
  title: 'The Artist',
  dateOfIssue: '2011',
  director: 'Michel Hazanavicius',
  genre: [
    'Comedy', 
    'Drama', 
    'Romance'
    ],
  description: 'An egomaniacal film star develops a relationship with a young dancer against the backdrop of Hollywood\'s silent era.'
},
{
  title: 'The King\'s Speech',
  dateOfIssue: '2010',
  director: 'Tom Hooper',
  genre: [
    'Biography', 
    'Drama', 
    'History'
    ],
  description: 'The story of King George VI, his impromptu ascension to the throne of the British Empire in 1936, and the speech therapist who helped the unsure monarch overcome his stammer.'
},
{
  title: 'Slumdog Millionaire',
  dateOfIssue: '2008',
  director: 'Danny Boyle, Loveleen Tandan',
  genre: [
    'Drama', 
    'Romance'
    ],
  description: 'A Mumbai teenager reflects on his life after being accused of cheating on the Indian version of "Who Wants to be a Millionaire?"'
}
]

app.use(express.static('public'));
app.use(morgan('common'));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//GET requests 
app.get('/', function(req, res) {
  res.send('Welcome!')
});
app.get('/movies', function(req, res) {
  res.json(oscarMovies)
});

app.listen(8080);
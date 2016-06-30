/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

var pg = require('pg');
var config = {
  user: 'top100', //env var: PGUSER
  database: 'top100_dev', //env var: PGDATABASE
  password: 'password', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);

var DATA_FILE = path.join(__dirname, 'top100.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/top100', function(req, res) {
  // fs.readFile(DATA_FILE, function(err, data) {
  //   if (err) {
  //     console.error(err);
  //     process.exit(1);
  //   }
  //   res.json(JSON.parse(data));
  // });
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM courses', function(err, result) {
      done();

      if(err) {
        return console.error('fuck you');
      }
      res.json(result.rows)
    })
  })
});

app.post('/api/top100', function(req, res) {
  // fs.readFile(DATA_FILE, function(err, data) {
  //   if (err) {
  //     console.error(err);
  //     process.exit(1);
  //   }
  //   var courses = JSON.parse(data);
  //   var newCourse = {
  //     rank: parseFloat(req.body.rank),
  //     name: req.body.name,
  //     location: req.body.location,
  //     architects: req.body.architects,
  //     year: req.body.year,
  //     score: parseFloat(req.body.score)
  //   };
  //   courses.push(newCourse);
  //   fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 4), function(err) {
  //     if (err) {
  //       console.error(err);
  //       process.exit(1);
  //     }
  //     res.json(courses);
  //   });
  // });
  var newCourse = req.body
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("INSERT INTO courses (us_rank, world_rank, name, location, architects, year, score, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [(parseInt(newCourse.us_rank) || null), (parseInt(newCourse.world_rank) || null), newCourse.name, newCourse.location, newCourse.architects, parseInt(newCourse.year), (parseInt(newCourse.score) || null), newCourse.state], function(err, result) {
      done();

      if(err) {
        return console.error('error', err);
      }
      res.json(true)
    })
  })
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

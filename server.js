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
var client = new pg.Client();
var config = {
  user: 'my_user', //env var: PGUSER
  database: 'my_db', //env var: PGDATABASE
  password: 'secret', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

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
  fs.readFile(DATA_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/top100', function(req, res) {
  fs.readFile(DATA_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var courses = JSON.parse(data);
    var newCourse = {
      id: parseFloat(req.body.id),
      name: req.body.name,
      location: req.body.location,
      architects: req.body.architects,
      year: req.body.year,
      score: parseFloat(req.body.score)
    };
    courses.push(newCourse);
    fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(courses);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

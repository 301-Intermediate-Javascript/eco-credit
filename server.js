'use strict';

// Required Packages
const superagent = require('superagent');
const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
require('dotenv').config();

// Imported Callback Functions

// Global Variables

const app = express();
const PORT = process.env.PORT || 5050;

// For Form Use

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_overrideMethod'));
// Config

app.set('view engine', 'ejs');

// Middleware
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

// Server Locations
// Get, POST etc
app.get('/', homeTest);

app.post('/account/exist', accountLogin);
app.get('/account/login', renderLogin);
app.post('/account/create', createAccount);
app.get('/dashboard/survey', takeSurvey);
app.post('/dashboard/map', displayMap);

// Route Callbacks

// test route for suggestions
app.get('/testsuggestions', (req, res) => {
  res.render('complete/suggestions');
})

//test route for CarbonFootprint API
app.get('/test2', getCarCO2);
function getCarCO2(req, res) {
  const url = 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel';
  const myKey = process.env.RAPID_API_KEY;
  const queryForSuper = {
    distance: '100',
    vehicle: 'SmallPetrolCar',
  };
  superagent.get(url)
    .set('x-rapidapi-key', myKey)
    .query(queryForSuper)
    .then(resultFromSuper => {
      const car = resultFromSuper.body.carbonEquivalent;
      let ecoScore = 50;
      if (car > 1.7) {
        ecoScore--;
      } else {
        ecoScore++;
      }
      const insertScore = `UPDATE profiles SET ecoscore=$1 WHERE username=$2`;
      const value = [ecoScore, 'bdavis'];
      client.query(insertScore, value)
        .then(eco => {
          console.log(eco);
        })
        .catch(error => {
          console.log('error from ecoScore :', error);
        })
      // Returns the CO2e in Kg from a travel by car
    })
    .catch(error => {
      console.log('error from getCarCO2 :', error);
    });
}

// Route '/'
function homeTest(req, res) {
  if (req.query.username) {
    res.render('complete/index', { 'loggedIn': true, 'user': req.query.username })
  } else {
    res.render('complete/index', { 'loggedIn': false, 'user': req.query.username })
  }

}

// Route '/account/new'


function createAccount(req, res) {
  const sqluserName = 'INSERT INTO profiles (username) VALUES($1) RETURNING ID';
  const userNamevalue = [req.body.userName];
  client.query(sqluserName, userNamevalue)
    .then(username => {
      const zipCodeSql = 'INSERT INTO location (username, zipcode) VALUES($1, $2)';
      const zipcodeValue = [username.rows[0].id, req.body.zipCode];
      client.query(zipCodeSql, zipcodeValue)
        .then(zipcode => {
          res.render('complete/login', { 'accountCreated': true, 'failed': false });
        })
    })
}


// Route '/account/login'

function renderLogin(req, res) {
  res.render('complete/login', { 'accountCreated': false, 'failed': false });
}

function accountLogin(req, res) {
  const sql = 'SELECT * from profiles WHERE username=$1';
  const value = [req.body.userName];
  client.query(sql, value)
    .then(userInfo => {
      if (userInfo.rows.length > 0) {
        res.redirect('/?username=' + req.body.userName);
      } else {
        res.render('complete/login', { 'failed': true, 'accountCreated': false })
      }
    })
}

// Route '/dashboard/survey'

function takeSurvey(req, res) {
  res.render('complete/survey', { 'user': req.query.username });
}

// Route '/dashboard/map'

function displayMap(req, res) {
  console.log(req.body)
  const idSql = 'SELECT * FROM profiles WHERE username=$1';
  const idValue = [req.query.username];
  client.query(idSql, idValue)
    .then(id => {
      console.log(id.rows)
      const sql = 'INSERT INTO surveyinfo (username, energy, shower, car_travel) VALUES($1, $2, $3, $4)';
      const values = [id.rows[0].id, req.body.electricity, req.body.shower, req.body.gas];
      client.query(sql, values)
        .then(result => {
          googleMap(res)
        })
    })
}
function googleMap(res) {
    
  const googleMaps = `https://maps.googleapis.com/maps/api/geocode/json?address=98146&key=${process.env.MAP_API}`;
  superagent(googleMaps)
    .then(map => {
      console.log(map.body.results[0].geometry.location);
      res.render('complete/map', { 'location': map.body.results[0].geometry.location, 'key': process.env.MAP_API })

    })
}
//Listen
app.listen(PORT, () => { console.log(`Listening to PORT ${PORT}`) });

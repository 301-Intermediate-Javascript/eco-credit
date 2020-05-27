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
app. get('/dashboard/survey', takeSurvey);
app.post('/dashboard/map', displayMap);

// Route Callbacks

// Route '/'
function homeTest(req, res){
    if(req.query.username){
      res.render('complete/index', {'loggedIn': true, 'user': req.query.username})
    }else {
      res.render('complete/index', {'loggedIn': false, 'user': req.query.username})
    }
}

// Route '/account/new'

function createAccount(req, res){
  const sqluserName = 'INSERT INTO profiles (username) VALUES($1) RETURNING ID';
  const userNamevalue = [req.body.userName];
  client.query(sqluserName, userNamevalue)
  .then(username => {
  const zipCodeSql = 'INSERT INTO location (username, zipcode) VALUES($1, $2)';
  const zipcodeValue = [username.rows[0].id, req.body.zipCode];
  client.query(zipCodeSql, zipcodeValue)
  .then(zipcode =>{
    res.render('complete/login', {'accountCreated': true, 'failed': false});
  })
  })
}

// Route '/account/login'

function renderLogin(req, res){
  res.render('complete/login', {'accountCreated': false, 'failed': false});
}

function accountLogin(req, res){
  const sql = 'SELECT * from profiles WHERE username=$1';
  const value = [req.body.userName];
  client.query(sql, value)
  .then(userInfo => {
    if(userInfo.rows.length > 0){
      res.redirect('/?username=' + req.body.userName);
    }else{
      res.render('complete/login', {'failed': true, 'accountCreated': false})
    }
  })
}

// Route '/dashboard/survey'

function takeSurvey(req, res){
  res.render('complete/survey', {'user': req.query.username});
};

// Route '/dashboard/map'

function displayMap(req, res){
  console.log(req.body)
  const idSql = 'SELECT id FROM profiles WHERE username=$1';
  const idValue = [req.query.username];
  client.query(idSql, idValue)
  .then(id => {
    const sql = 'INSERT INTO surveyinfo (username, energy, shower, car_travel) VALUES($1, $2, $3, $4)';
    const values = [id.rows[0].id, req.body.electricity, req.body.shower, req.body.gas];
    client.query(sql, values)
    .then(result => {
      const googleMaps = 'https://maps.googleapis.com/maps/api/geocode/json?address=98146&key=AIzaSyAQBXJLLKKnFDBx1eG3NrwyXEuNzY93jkA';
      superagent(googleMaps)
      .then(map =>{
        console.log(map);
        res.render('complete/map')

      })
    })
  })
}

//Listen
app.listen(PORT, () => { console.log(`Listening to PORT ${PORT}`) });

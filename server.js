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
app.post('/account/new', createAccount);
app.get('/account/login', renderLogin);

// Route Callbacks

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
      console.log(resultFromSuper.body.carbonEquivalent)
      res.send(resultFromSuper.body.carbonEquivalent)
      // Returns the CO2e in Kg from a travel by car
    })
    .catch(error => {
      console.log('error from getCarCO2 :', error);
    });
}

// Route '/'
function homeTest(req, res){
    res.render('complete/index')
}

// Route '/account/new'

function createAccount(req, res){
  const sql = 'INSERT INTO profiles (username, zipcode) VALUES($1, $2)';
  const values = [req.body.userName, req.body.password, req.body.zipCode];
  client.query(sql, values)
  .then(result => {
    res.render('complete/login');
  })
}


// Route '/account/login'

function renderLogin(req, res){
  res.render('complete/login');
}

function accountLogin(req, res){
  console.log(req.body);
  const sql = 'SELECT * from profiles WHERE username=$1';
  const value = [req.body.userName];
  client.query(sql, value)
  .then(userInfo => {
    console.log(userInfo);
  
  })
}

//Listen
app.listen(PORT, () => { console.log(`Listening to PORT ${PORT}`) });

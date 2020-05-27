'use strict';

// Required Packages
const superAgent = require('superagent');
const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
require('dotenv').config();

// Imported Callback Functions

// Global Variables

const app = express();
const PORT = process.env.PORT || 5050;

// For Form Use

app.use(express.static('./Public'));
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
app.post('/account/create', createAccount)

// Route Callbacks

// Route '/'
function homeTest(req, res){
    res.render('complete/index')
}

// Route '/account/new'

function createAccount(req, res){
  const sqluserName = 'INSERT INTO profiles (username) VALUES($1) RETURNING ID';
  const userNamevalue = [req.body.userName];
  client.query(sqluserName, userNamevalue)
  .then(username => {
    console.log(username)
  const zipCodeSql = 'INSERT INTO location (username, zipcode) VALUES($1, $2)';
  const zipcodeValue = [username.rows[0].id, req.body.zipCode];
  client.query(zipCodeSql, zipcodeValue)
  .then(zipcode =>{
    console.log(req.body.userName);
    res.render('complete/index', {'user': req.body.userName, 'loggedIn': true});
  })
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
    res.redirect('/');
  })
}

//Listen

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`)
});
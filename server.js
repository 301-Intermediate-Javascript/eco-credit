'use strict';

// Required Packages
const superagent = require('superagent');
const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
require('dotenv').config();

// Imported Callback Functions

// Route '/'
const homeTest = require('./Modules/home.js')
// Route '/account/new'
const createAccount = require('./Modules/accountNew.js')
// Route '/account/login'
const renderLogin = require('./Modules/renderLogin.js')
// Route '/aacount/exist'
const accountLogin = require('./Modules/accountExist.js')
// Route '/dashboard/survey'
const takeSurvey = require('./Modules/takeSurvey.js')
// Route '/dashboard/map'
const displayMap = require('./Modules/displayMap.js')
//Route '/dashboard/survey/get'
const getSurvey = require('./Modules/getSurvey.js')
// Route '/dashboard/survey/update'
const updateSurvey = require('./Modules/updateSurvey.js')
// Route '/account/view'
const viewAccount = require('./Modules/viewAccount.js')
// Route '/account/update'
const updateAccount = require('./Modules/updateAccount.js')


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
app.get('/dashboard/survey/get', getSurvey)
app.put('/dashboard/survey/update/done', updateSurvey);
app.get('/account/view', viewAccount);
app.put('/account/update', updateAccount);

// test route for suggestions
// app.get('/testsuggestions', (req, res) => {
//   res.render('complete/suggestions');
// })

// Listen - Server Port

app.listen(PORT, () => { console.log(`Listening to PORT ${PORT}`) });

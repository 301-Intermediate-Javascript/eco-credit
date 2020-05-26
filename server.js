'use strict';

// Required Packages
const superAgent = require('superagent');
const express = require('express');
const methodOverride = require('method-override');
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
    // const pg = require('pg');
    // const client = new pg.Client(process.env.DATABASE_URL);
    // client.on('error', console.error);
    // client.connect();

// Server Locations
// Get, POST etc

app.get('/', homeTest);

function homeTest(req, res){
    res.render('complete/index')
}

//Listen

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`)
});
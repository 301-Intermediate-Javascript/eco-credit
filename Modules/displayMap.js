const pg = require('pg');
const superagent = require('superagent');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


function displayMap(req, res) {
  const url = 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel';
  const myKey = process.env.RAPID_API_KEY;
  const queryForSuper = {
    distance: '100', //TODO: This will need to be updated to pull from req.body
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
      sql(req, res, ecoScore)
    })
}

function googleMap(req, res, eco, id) {
  const zipSql = `SELECT zipcode FROM location WHERE username=${id}`;
  client.query(zipSql)
    .then(results => {
      const googleMaps = `https://maps.googleapis.com/maps/api/geocode/json?address=${results.rows[0].zipcode}&key=${process.env.MAP_API}`;
      superagent(googleMaps)
        .then(map => {
          renderMap(req, res, map, eco)
        })
        .catch(error => {
          console.log('error from homeTest sql query : ', error)
        });

    })
}

function renderMap(req, res, map, eco) {
  const getEcoScore = 'SELECT ecoscore FROM profiles WHERE username=$1';
  const values = [req.query.username];
  client.query(getEcoScore, values)
    .then(returningEcoScore => {
      console.log(returningEcoScore.rows[0].ecoscore);
      console.log(eco.rows)
      res.render('complete/map', { 'location': map.body.results[0].geometry.location, 'eco': eco.rows, 'user': req.query.username, 'id': req.query.id, 'loggedIn': true, 'ecoscore': returningEcoScore.rows[0].ecoscore })

    })
}

function sql(req, res, ecoScore) {
  const insertScore = `UPDATE profiles SET ecoscore=$1 WHERE username=$2`;
  const value = [ecoScore, req.query.username];
  client.query(insertScore, value)
    .then(eco => {
      const idSql = 'SELECT id FROM profiles WHERE username=$1';
      const idValue = [req.query.username];
      client.query(idSql, idValue)
        .then(id => {
          const sql = 'INSERT INTO surveyinfo (username, energy, shower, car_travel) VALUES($1, $2, $3, $4)';
          const values = [id.rows[0].id, req.body.electricity, req.body.shower, req.body.gas];
          client.query(sql, values)
            .then(result => {
              const ecoScoreSql = 'SELECT ecoscore FROM profiles';
              client.query(ecoScoreSql)
                .then(eco => {
                  googleMap(req, res, eco, id.rows[0].id)
                })
            })
        })
    })
}

module.exports = displayMap;
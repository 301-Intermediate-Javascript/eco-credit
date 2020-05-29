const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function updateSurvey(req, res) {
    console.log(req.query)
    const sql = 'UPDATE surveyinfo SET energy=$1, shower=$2, car_travel=$3 WHERE username=$4';
    const values = [req.body.energy, req.body.shower, req.body.car_travel, req.query.id];
    client.query(sql, values)
      .then(result => {
        console.log(req.query.username)
        res.redirect('/dashboard/survey/get?username=' + req.query.username)
      })
  }

module.exports = updateSurvey;
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function getSurvey(req, res) {
    const surveySql = 'SELECT id FROM profiles WHERE username=$1';
    const value = [req.query.username];
    client.query(surveySql, value)
      .then(id => {
        const updateSql = 'SELECT * FROM surveyinfo WHERE username=$1';
        const updateValue = [id.rows[0].id];
        client.query(updateSql, updateValue)
          .then(results => {
            res.render('complete/updateSurvey', { 'surveyInfo': results.rows[results.rows.length - 1], username: req.query.username })
          })
      })
  }

module.exports = getSurvey;
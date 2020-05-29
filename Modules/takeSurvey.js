const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


function takeSurvey(req, res) {
    const getEcoScore = 'SELECT ecoscore FROM profiles WHERE username=$1';
    const values = [req.query.username];
    client.query(getEcoScore, values)
      .then(returningEcoScore => {
        console.log(returningEcoScore.rows[0].ecoscore);
        res.render('complete/survey', { 'user': req.query.username, 'id': req.query.id, 'loggedIn': true, 'ecoscore': returningEcoScore.rows[0].ecoscore });
      })
      .catch(error => {
        console.log('error from homeTest sql query : ', error)
      });
  }

module.exports = takeSurvey;
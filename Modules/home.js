const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


function homeTest(req, res) {
    if (req.query.username) {
      //TODO: figure out where this goes...
      //function to retrieve ecoscore
      const getEcoScore = 'SELECT ecoscore FROM profiles WHERE username=$1';
      const values = [req.query.username];
      client.query(getEcoScore, values)
        .then(returningEcoScore => {
          res.render('complete/index', { 'loggedIn': true, 'id': req.query.id, 'user': req.query.username, 'ecoscore': returningEcoScore.rows[0].ecoscore })
        })
        .catch(error => {
          console.log('error from homeTest sql query : ', error)
        });
  
    } else {
      res.render('complete/index', { 'loggedIn': false, 'user': req.query.username })
    }
  }



  

  module.exports = homeTest;
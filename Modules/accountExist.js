const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


function accountLogin(req, res) {
    const sql = 'SELECT * from profiles WHERE username=$1';
    const value = [req.body.userName];
    client.query(sql, value)
      .then(userInfo => {
        if (userInfo.rows.length > 0) {
          res.redirect('/?username=' + req.body.userName + '&id=' + userInfo.rows[0].id);
        } else {
          res.render('complete/login', { 'failed': true, 'accountCreated': false, 'loggedIn': false })
        }
      })
      .catch(error => {
        console.log('error from accountLogin: ', error);
      })
  }

  module.exports = accountLogin;
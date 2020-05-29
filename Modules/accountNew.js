const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


function createAccount(req, res) {
    const sqluserName = 'INSERT INTO profiles (username) VALUES($1) RETURNING ID';
    const userNamevalue = [req.body.userName];
    client.query(sqluserName, userNamevalue)
      .then(username => {
        const zipCodeSql = 'INSERT INTO location (username, zipcode) VALUES($1, $2)';
        const zipcodeValue = [username.rows[0].id, req.body.zipCode];
        client.query(zipCodeSql, zipcodeValue)
          .then(zipcode => {
            res.render('complete/login', { 'accountCreated': true, 'failed': false, 'loggedIn': false });
          })
      })
  }

module.exports = createAccount;
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function updateAccount(req, res) {
    const sql = 'UPDATE profiles SET username=$1 WHERE id=$2';
    const value = [req.body.username, req.query.id];
    client.query(sql, value)
      .then(() => {
        console.log(req.body)
        const zipSql = 'UPDATE location SET zipcode=$1 WHERE username=$2';
        const zipValue = [req.body.zipcode, req.query.id];
        client.query(zipSql, zipValue)
          .then(() => {
            res.redirect('/account/view?username=' + req.body.username + '&id=' + req.query.id)
          })
      })
  }

module.exports = updateAccount;
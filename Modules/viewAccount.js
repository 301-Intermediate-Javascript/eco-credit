const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function viewAccount(req, res) {
    const sql = 'SELECT * FROM profiles WHERE username=$1';
    const value = [req.query.username];
    client.query(sql, value)
      .then(results => {
        const zipSql = 'SELECT zipcode FROM location WHERE username=$1';
        const zipvalue = [req.query.id];
        client.query(zipSql, zipvalue)
          .then(zip => {
            res.render('complete/account', { 'user': results.rows[0], 'zipcode': zip.rows[0].zipcode, 'id': req.query.id })
          })
      })
  }

module.exports = viewAccount;
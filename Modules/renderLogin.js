function renderLogin(req, res) {
    res.render('complete/login', { 'accountCreated': false, 'failed': false, 'loggedIn': false });
  }

  module.exports = renderLogin;
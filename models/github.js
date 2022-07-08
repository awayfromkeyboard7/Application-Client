const request = require('superagent');

module.exports = function githubLogin(req, res) {
  const { query } = req;
  const { code } = query;

  if (!code) {
    return res.send({
      success: false,
      message: "Error: no code"
    });
  }

  request
    .post('https://github.com/login/oauth/access_token')
    .send({
      client_id: 'd60ab84b8b71755b67d2',
      client_secret: 'e8b324f9c718aee644a3393e305c1e56b9c6f050',
      code: code
    })
    .set('Accept', 'application/json')
    .then(function(result) {
      const data = result.body;
      res.send(data);
    })
}
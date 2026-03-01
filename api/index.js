const app = require('../backend/app');

module.exports = (req, res) => {
  const path = req.query.path;
  if (path) req.url = `/api/${path}`;
  app(req, res);
};

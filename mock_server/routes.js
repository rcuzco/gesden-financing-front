var appRouter = function (app) {

  app.get('/:resource', function (req, res) {
    var resource = req.params.resource;
    var url = `./mocks/${resource}.json`;
    var data = require(url);
    response(res, data);
  });

  app.get('/:resource/:id', function (req, res) {
    var resource = req.params.resource;
    var url = `./mocks/${resource}.json`;
    var data = require(url);
    response(res, data);
  });
}


function response(res, data) {
  setTimeout(function () {
    return res.send(data);
  }, getRandomInt(2000, 300));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = appRouter;

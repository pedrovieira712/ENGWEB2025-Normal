var express = require('express');
var router = express.Router();
var Edicao = require('../controllers/edicao');

/* GET / devolver lista dos intérpretes, com o nome e o país que o intérprete representou, ordenada alfabeticamente por nome e sem repetições; */
router.get('/', function(req, res, next) {
  Edicao.getInterpretes()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Edicao = require('../controllers/edicao');


router.get('/', function(req, res, next) {
  /* GET /paises?papel=org: devolve a lista dos países organizadores, ordenada alfabeticamente por nome e sem repetições (lista de pares: país, lista de anos em que organizou); */
  if (req.query.papel === 'org') {
    Edicao.getPaisesOrganizadores()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }else if (req.query.papel === 'venc') {
    /* GET /paises?papel=venc: dos países vencedores, ordenada alfabeticamente por nome e sem repetições(lista de pares: país, lista de anos em que venceu);.*/
    Edicao.getPaisesVencedores()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get("/info/:pais", (req, res) => {
  Edicao.getInfoPais(req.params.pais)
    .then((data) => res.status(200).jsonp(data))
    .catch((erro) => res.status(500).jsonp(erro))
})

router.get('/:pais', function(req, res, next) {
  Edicao.getPaises(req.params.pais)
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
});


module.exports = router;

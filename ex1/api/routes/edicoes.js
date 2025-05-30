var express = require('express');
var router = express.Router();
var Edicao = require('../controllers/edicao');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.query.org) {
    Edicao.findByOrg(req.query.org)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro)) 
  } else {
    Edicao.list()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }
});

router.get('/:id', function(req, res, next) {
  Edicao.findById(req.params.id)
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
});

router.post("/", (req, res, next) => {
  Edicao.insert(req.body)
    .then((data) => res.status(201).jsonp(data))
    .catch((erro) => res.status(500).jsonp(erro))
})

// PUT /edicoes/:id
router.put("/:id", (req, res, next) => {
  Edicao.update(req.params.id, req.body)
    .then((data) => res.status(200).jsonp(data))
    .catch((erro) => res.status(500).jsonp(erro))
})

// DELETE /edicoes/:id
router.delete("/:id", (req, res, next) => {
  Edicao.delete(req.params.id)
    .then((data) => res.status(200).jsonp(data))
    .catch((erro) => res.status(500).jsonp(erro))
})



module.exports = router;

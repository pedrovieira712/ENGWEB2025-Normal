var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res) {
  axios.get("http://localhost:25000/edicoes")
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('homePage', {title: 'Edições do Festival Eurovisão', edicoes: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
});

router.get('/:id', function(req, res) {
  var id = req.params.id
  axios.get("http://localhost:25000/edicoes/" + id)
  .then(resp => {
    data = resp.data
    res.status(200)
    res.render('edicaoPage', {title: `Eurovisão ${data.anoEdicao} - ${data.organizacao}`, edicao: data });
  })
  .catch(erro => {
    console.log(erro)
    res.render('error', {error: erro})
  })
})


router.get("/paises/:pais", (req, res) => {
  axios
    .get(`http://localhost:25000/paises/info/${req.params.pais}`)
    .then((resp) => {
      res.render("paisPage", {
        title: `País: ${req.params.pais} - Festival Eurovisão`,
        pais: resp.data,
      })
    })
    .catch((erro) => {
      console.log("Erro ao buscar dados do país:", erro)
      res.render("error", {
        title: "Erro - País não encontrado",
        error: erro,
      })
    })
})

module.exports = router


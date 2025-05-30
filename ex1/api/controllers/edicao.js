var Edicao = require("../models/edicao")

// GET /edicoes - Lista todas as edições
module.exports.list = () => {
  return Edicao.find({}, "anoEdicao organizacao vencedor")
    .sort({ anoEdicao: 1 })
    .exec()
}

// GET /edicoes/:id - Devolve toda a informação da edição com identificador id
module.exports.findById = (id) => {
  return Edicao
    .findOne({ _id: id })
    .exec()
}

// GET /edicoes?org=EEEE - Lista das edições organizadas por EEEE
module.exports.findByOrg = (organizacao) => {
  return Edicao
    .find({ organizacao: organizacao }, "anoEdicao organizacao vencedor")
    .sort({ anoEdicao: 1 })
    .exec()
}

// GET /paises?papel=org - Lista dos países organizadores
module.exports.getPaisesOrganizadores = () => {
  return Edicao.aggregate([
    {
      $group: {
        _id: "$organizacao",
        anos: { $push: "$anoEdicao" },
      },
    },
    {
      $project: {
        _id: 0,
        pais: "$_id",
        anos: { $sortArray: { input: "$anos", sortBy: 1 } },
      },
    },
    {
      $sort: { pais: 1 },
    },
  ]).exec()
}

// GET /paises?papel=venc - Lista dos países vencedores
module.exports.getPaisesVencedores = () => {
  return Edicao.aggregate([
    {
      $match: { vencedor: { $ne: null } },
    },
    {
      $group: {
        _id: "$vencedor",
        anos: { $push: "$anoEdicao" },
      },
    },
    {
      $project: {
        _id: 0,
        pais: "$_id",
        anos: { $sortArray: { input: "$anos", sortBy: 1 } },
      },
    },
    {
      $sort: { pais: 1 },
    },
  ]).exec()
}

// GET /interpretes - Lista dos intérpretes com nome e país
module.exports.getInterpretes = () => {
  return Edicao.aggregate([
    {
      $unwind: "$musicas",
    },
    {
      $group: {
        _id: "$musicas.interprete",
        pais: { $first: "$musicas.pais" },
      },
    },
    {
      $project: {
        _id: 0,
        nome: "$_id",
        pais: "$pais",
      },
    },
    {
      $sort: { nome: 1 },
    },
  ]).exec()
}

// POST /edicoes - Acrescenta um registo novo à BD
module.exports.insert = (edicao) => {
  var novaEdicao = new Edicao(edicao)
  return novaEdicao.save()
}

// PUT /edicoes/:id - Altera o registo da edição com o identificador id
module.exports.update = (id, edicao) => {
  return Edicao.findOneAndUpdate({ _id: id }, edicao, { new: true, runValidators: true }).exec()
}

// DELETE /edicoes/:id - Elimina da BD o registo correspondente à edição
module.exports.delete = (id) => {
  return Edicao.findOneAndDelete({ _id: id }).exec()
}

module.exports.getPaises = (pais) => {
  return Edicao.find({ organizacao: pais }, "anoEdicao organizacao vencedor")
    .sort({ anoEdicao: 1 })
    .exec()
}

// Para facilitar o /paises/:pais, do ex2
module.exports.getInfoPais = async (pais) => {
  try {
    const organizacoes = await Edicao.find({ organizacao: pais }, "anoEdicao _id").sort({ anoEdicao: 1 }).lean()

    const participacoes = await Edicao.aggregate([
      { $unwind: "$musicas" },
      { $match: { "musicas.pais": pais } },
      {
        $project: {
          id: "$_id",
          ano: "$anoEdicao",
          musica: "$musicas.titulo",
          interprete: "$musicas.interprete",
          venceu: { $eq: ["$vencedor", pais] },
        },
      },
      { $sort: { ano: 1 } },
    ])

    return {
      nome: pais,
      participacoes: participacoes,
      organizacoes: organizacoes.map((org) => ({
        id: org._id,
        ano: org.anoEdicao,
      })),
    }
  } catch (erro) {
    console.error("Erro ao buscar informações do país:", erro)
    throw erro
  }
}
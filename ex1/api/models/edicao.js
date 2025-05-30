var mongoose = require("mongoose")

var musicaSchema = new mongoose.Schema(
  {
    id: String,
    titulo: String,
    pais: String,
    interprete: String,
    compositor: { type: String, default: null },
    letra: { type: String, default: null },
    link: { type: String, default: null },
  },
  { _id: false },
)

var edicaoSchema = new mongoose.Schema(
  {
    _id: String,  
    anoEdicao: { type: Number, required: true },
    organizacao: { type: String, required: true },
    vencedor: { type: String, default: null },
    musicas: [musicaSchema], 
  },
  { versionKey: false },
)

module.exports = mongoose.model("edicoes", edicaoSchema)

//const { response, request } = require("express");
//const res = response;
//const req = request;
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const usuarioGet = async (req, res) => {
  //const query = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  /*   const usuarios = await Usuario.find(query).skip(desde).limit(limite);
  const total = await Usuario.countDocuments(query); */

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);
  res.json({
    total,
    usuarios,
  });
};

const usuarioPost = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const usuario = new Usuario({ nombre, email, password, rol });
  //Encriptar passwd
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);
  await usuario.save();
  res.json({
    usuario,
  });
};

const usuarioPut = async (req, res) => {
  const id = req.params.id;
  const { _id, password, google, email, ...resto } = req.body;

  // Validar contra dB
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json({
    usuario,
  });
};

const usuarioDelete = async (req, res) => {
  const { id } = req.params;

  //Borrar fisicamente

  //const usuario = await Usuario.findByIdAndDelete(id);
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  res.json({
    usuario,
  });
};
module.exports = {
  usuarioGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
};

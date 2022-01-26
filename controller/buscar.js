const { request, response } = require("express");
const { check, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models/index");

const coleccionesPermitidas = ["usuarios", "roles", "categorias", "productos"];
const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = isValidObjectId(termino);
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json(usuario);
  } else {
    const regexp = new RegExp(termino, "i");
    const usuario = await Usuario.find({
      $or: [{ nombre: regexp }, { correo: regexp }],
      $and: [{ estado: true }],
    });
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }
};
const buscarCategorias = async (termino = "", res = response) => {
  const esMongoID = isValidObjectId(termino);
  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json(categoria);
  } else {
    const regexp = new RegExp(termino, "i");
    const categoria = await Categoria.find({
      nombre: regexp,
      $and: [{ estado: true }],
    });
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }
};
const buscarProducto = async (termino = "", res = response) => {
  const esMongoID = isValidObjectId(termino);
  if (esMongoID) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.json(producto);
  } else {
    const regexp = new RegExp(termino, "i");
    const producto = await Producto.find({
      nombre: regexp,
      $and: [{ estado: true }],
    }).populate("categoria", "nombre");
    return res.json({
      results: producto ? [producto] : [],
    });
  }
};

const buscar = async (req = request, res = response) => {
  const { coleccion, termino } = req.params;
  const existeColeccion = coleccionesPermitidas.includes(coleccion);
  if (!existeColeccion) {
    return res.status(400).json({
      msg: `la coleccion no existe, las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }
  let busqueda = undefined;
  switch (coleccion) {
    case "usuarios":
      /* busqueda = await Usuario.findOne({ nombre: termino });
      res.status(200).json(busqueda); */
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);

      break;
    case "productos":
      buscarProducto(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se le olvido hacer esta busqueda",
      });
      break;
  }
};

module.exports = {
  buscar,
};

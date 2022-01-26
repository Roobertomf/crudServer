const { response, request } = require("express");
const Categoria = require("../models/categoria");
const articulosGet = (req, res) => {
  res.json({
    msg: "ok",
  });
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const existeCategoria = await Categoria.findOne({ nombre });
  if (existeCategoria) {
    return res.status(400).json({
      msg: `La categoria ${nombre} ya existe`,
    });
  }
  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = new Categoria(data);

  await categoria.save();
  res.status(201).json({
    categoria,
  });
};
//obtener Categorias Paginado -total - populate

const listarCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre"),
  ]);
  res.json({
    total,
    categorias,
  });
};
//obtener Categoria - populate -{}
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json(categoria);
};
//actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const { nombre } = req.body;

  const updateCat = await Categoria.findByIdAndUpdate(
    id,
    {
      nombre: nombre.toUpperCase(),
      usuario: req.usuario._id,
    },
    { new: true }
  );

  res.json({ updateCat });
};
//borrar categoria- estado false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const borrarCat = await Categoria.findByIdAndUpdate(id, { estado: false });
  res.json(borrarCat);
};
module.exports = {
  articulosGet,
  crearCategoria,
  obtenerCategoria,
  listarCategorias,
  actualizarCategoria,
  borrarCategoria,
};

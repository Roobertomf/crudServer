const { request, response } = require("express");
const Producto = require("../models/producto");
const crearProducto = async (req = request, res = response) => {
  const { nombre, precio, categoria, descripcion } = req.body;
  const existeProducto = await Producto.findOne({
    nombre: nombre.toUpperCase(),
  });
  if (existeProducto) {
    return res.status(401).json({
      msg: `El producto ${nombre} ya existe`,
    });
  }
  const newProduct = new Producto({
    nombre: nombre.toUpperCase(),
    usuario: req.usuario._id,
    precio,
    categoria,
    descripcion,
  });
  await newProduct.save();
  res.json(newProduct);
  //const nuevoProducto = new Producto({ nombre, usuario });
};

const listarProductos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre"),
  ]);
  res.json({
    total,
    productos,
  });
};
const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json(producto);
};
const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { estado, ...data } = req.body;
  let campo = {};
  if (data.nombre) campo.nombre = data.nombre.toUpperCase();
  if (data.precio) campo.precio = data.precio;
  if (data.categoria) campo.categoria = data.categoria;
  if (data.descripcion) campo.descripcion = data.descripcion;
  if (data.disponible) campo.disponible = data.disponible;
  data.usuario = req.usuario._id;
  await Producto.findByIdAndUpdate(id, campo, { new: true });
  res.json(campo);
};
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const borrarProd = await Producto.findByIdAndUpdate(id, { estado: false });
  res.json(borrarProd);
};
module.exports = {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};

const Role = require("../models/role");
const { Usuario, Categoria, Producto } = require("../models");

const rolValidator = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(
      `El rol ${rol} no es valido debe ser ADMIN_ROLE o USER_ROLE`
    );
  }
};
const emailExiste = async (email = "") => {
  console.log(email);
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    throw new Error(`El correo ${email} ya esta en uso`);
  }
};
const usuarioIdExiste = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }
};
const categoriaExiste = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe`);
  }
};
const productoExiste = async (id) => {
  const existeProducto = await Producto.findById(id);

  if (!existeProducto) {
    throw new Error(`El id ${id} no existe`);
  }
};

//validar colecciones permitidas
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `la coleccion ${coleccion} no es permitida-- ${colecciones}`
    );
  }
  return true;
};
module.exports = {
  rolValidator,
  emailExiste,
  usuarioIdExiste,
  categoriaExiste,
  productoExiste,
  coleccionesPermitidas,
};

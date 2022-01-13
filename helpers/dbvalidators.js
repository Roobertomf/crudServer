const Role = require("../models/role");
const Usuario = require("../models/usuario");

const rolValidator = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(
      `El rol ${rol} no es valido debe ser Admin_Role o User_Role`
    );
  }
};
const emailExiste = async (email = "") => {
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

module.exports = {
  rolValidator,
  emailExiste,
  usuarioIdExiste,
};

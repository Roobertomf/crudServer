const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const Usuario = require("../models/usuario");

const login = async (req, res) => {
  const { correo, password } = req.body;
  console.log(correo);
  try {
    //Verificar si el email exite
    const usuario = await Usuario.findOne({ email: correo });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario o contraseña no son correctos - correo",
      });
    }
    //Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario o contraseña no son correctos - usuario inactivo",
      });
    }

    //Verificar si la contraseña es correcto
    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Usuario o contraseña no son correctos - password",
      });
    }
    //generar jwt
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};

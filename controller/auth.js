const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
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
const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { nombre, img, email } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      const data = {
        nombre,
        email,
        password: ":P",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    //Generar token
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: " El token no se pudo verificar",
      error,
    });
  }
};

module.exports = {
  login,
  googleSignin,
};

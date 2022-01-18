const { request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const validarjwt = async (req = request, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "no hay token en la peticion",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);
    // verifica si uid tiene estado true

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido- usuario no existe en DB",
      });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido- usuario con estado false",
      });
    }
    //req.uid = uid;
    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarjwt,
};

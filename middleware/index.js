const validarCampos = require("../middleware/validar-campos");
const validarjwt = require("../middleware/validar-jwt");
const validarRoles = require("../middleware/validar-roles");

module.exports = {
  ...validarCampos,
  ...validarjwt,
  ...validarRoles,
};

const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignin } = require("../controller/auth");
const { articulosGet } = require("../controller/categorias");
const { validarCampos } = require("../middleware/validar-campos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);
router.post(
  "/google",
  [
    check("id_token", "id_Token de google obligatorio").not().isEmpty(),
    validarCampos,
  ],
  googleSignin
);

router.get("/a", articulosGet);

module.exports = router;

const { Router } = require("express");
const { check } = require("express-validator");

const {
  usuarioGet,
  usuarioPost,
  usuarioPut,
  usuarioDelete,
} = require("../controller/user");
const {
  rolValidator,
  emailExiste,
  usuarioIdExiste,
} = require("../helpers/dbvalidators");
const { validarCampos } = require("../middleware/validar-campos");
const router = Router();

router.get("/", usuarioGet);
router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioIdExiste),
    check("rol").custom(rolValidator),

    validarCampos,
  ],
  usuarioPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "La contraseña es obligatorio y debe ser mayor a 6 caracteres"
    ).isLength({ min: 6 }),
    check("email", "El correo no es valido").isEmail(),
    check("email").custom(emailExiste),
    check("rol").custom(rolValidator),
    validarCampos,
  ],

  usuarioPost
);
router.delete(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioIdExiste),
    validarCampos,
  ],
  usuarioDelete
);

module.exports = router;

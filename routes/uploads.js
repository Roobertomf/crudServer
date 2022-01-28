const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImg,
  mostrarImg,
  actualizarImgCloudinary,
} = require("../controller/uploads");
const { coleccionesPermitidas } = require("../helpers/dbvalidators");

const { validarCampos } = require("../middleware/validar-campos");
const validarArchivo = require("../middleware/validarArchivo");

const router = Router();

router.post("/", [], cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivo,
    check("id", "No es un mongo id").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),

    validarCampos,
  ],
  actualizarImgCloudinary
);
router.get(
  "/:coleccion/:id",
  [
    check("id", "No es un mongo id").isMongoId(),
    check("coleccion").custom(
      (c) => coleccionesPermitidas(c, ["usuarios", "productos"]),
      validarCampos
    ),
  ],
  mostrarImg
);
module.exports = router;

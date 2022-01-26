const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategoria,
  listarCategorias,
  actualizarCategoria,
  borrarCategoria,
} = require("../controller/categorias");
const { categoriaExiste } = require("../helpers/dbvalidators");
const { esAdmin } = require("../middleware/validar-roles");
const { validarjwt, validarCampos } = require("../middleware/index");

const router = Router();

// {{url}}/api/categoria
// obtener todas las categorias -publico
router.get("/", listarCategorias);

// obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  obtenerCategoria
);

// crear una categoria - privado cualquier persona con token valido
router.post(
  "/",
  [
    validarjwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),

    validarCampos,
  ],
  crearCategoria
);
// actualizar categoria - privado cualquier persona con token valido
router.put(
  "/:id",
  [
    validarjwt,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(categoriaExiste),
    check("nombre", "El nombre nuevo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);
//borrar categoria - admin
router.delete(
  "/:id",
  [
    validarjwt,
    esAdmin,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;

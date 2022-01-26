const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controller/productos");
const { productoExiste, categoriaExiste } = require("../helpers/dbvalidators");
const { validarjwt, validarCampos, esAdmin } = require("../middleware");

const router = Router();

router.get("/", [], listarProductos);

// obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id valido de Mongo").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  obtenerProducto
);

// crear una categoria - privado cualquier persona con token valido
router.post(
  "/",
  [
    validarjwt,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "la categoria es obligatoria").not().isEmpty(),
    check("categoria", "la categoria no es un id de mongo").isMongoId(),
    check("categoria").custom(categoriaExiste),
    validarCampos,
  ],
  crearProducto
);
// actualizar categoria - privado cualquier persona con token valido

router.put(
  "/:id",
  [
    validarjwt,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  actualizarProducto
);
//borrar categoria - admin
router.delete(
  "/:id",
  [
    validarjwt,
    esAdmin,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;

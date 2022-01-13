const { Schema, model } = require("mongoose");
const userSchema = Schema({
  nombre: {
    type: String,
    required: [true, "Nombre obligatorio"],
  },
  email: {
    type: String,
    required: [true, "Correo obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Contraseña obligatoria"],
  },
  img: String,
  rol: {
    type: String,
    required: [true, "El rol es requerido"],
    emun: ["Admin_Role", "User_Role"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.toJSON = function () {
  const { password, __v, ...usuario } = this.toObject();
  return usuario;
};
module.exports = model("Usuario", userSchema);

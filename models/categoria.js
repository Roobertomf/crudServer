const { Schema, model } = require("mongoose");
const categoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "Nombre obligatorio"],
    unique: true,
  },

  estado: {
    type: Boolean,
    default: true,
    required: true,
  },

  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

categoriaSchema.methods.toJSON = function () {
  const { estado, __v, ...data } = this.toObject();

  return data;
};

module.exports = model("Categoria", categoriaSchema);

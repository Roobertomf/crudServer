const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models/index");

const cargarArchivo = async (req = request, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, "images");
    res.json({
      nombre,
    });
  } catch (msj) {
    res.status(400).json({
      msj,
    });
  }
};

const actualizarImg = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un usuario con id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un producto con id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //borrar la img del servidor
    const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();
  res.json({ modelo });
};

const mostrarImg = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un usuario con id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un producto con id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //borrar la img del servidor
    const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }
  const pathImg = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImg);
};

const actualizarImgCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un usuario con id ${id}`,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `no existe un producto con id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;

  await modelo.save();
  res.json(modelo);
};

module.exports = {
  cargarArchivo,
  actualizarImg,
  mostrarImg,
  actualizarImgCloudinary,
};

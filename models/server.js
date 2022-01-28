const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
const fileUpload = require("express-fileupload");
class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      categorias: "/api/categorias",
      usuarios: "/api/usuarios",
      productos: "/api/productos",
      buscar: "/api/buscar",
      upload: "/api/upload",
    };
    //conexion db
    this.connectDB();
    //middlewares
    this.middlewares();
    this.routes();
  }
  async connectDB() {
    await dbConnection();
  }
  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.upload, require("../routes/uploads"));
  }
  listen() {
    const PORT = process.env.PORT;

    this.app.listen(this.PORT, () => {
      console.log(`APLICACION CORRIENDO EN localhost:${this.PORT}`);
    });
  }

  middlewares() {
    this.app.use(cors());
    //directorio Publico
    this.app.use(express.static("public"));

    //lectura y parseo
    this.app.use(express.json());

    //file upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }
}

module.exports = Server;

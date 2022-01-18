const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";

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
    this.app.use(this.authPath, require("../routes/auth"));

    this.app.use(this.usuariosPath, require("../routes/user"));
  }
  listen() {
    const PORT = process.env.PORT;

    this.app.listen(this.PORT, () => {
      console.log(`APLICACION CORRIENDO EN localhost:${this.PORT}`);
    });
  }

  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(cors());

    //lectura y parseo
    this.app.use(express.json());
  }
}

module.exports = Server;

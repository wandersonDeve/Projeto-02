const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
require("dotenv").config();
require("express-async-errors");
const router = express.Router();

(async () => {
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;
  const dbName = process.env.DB_NAME;
  const dbHost = process.env.DB_HOST;

  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 8080;
  const connectionString = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

  const options = {
    useUnifiedTopology: true,
  };

  const client = await mongodb.MongoClient.connect(connectionString, options);

  const db = client.db("Rick");
  const personagens = db.collection("rickrick");

  const getPersonagensValidas = () => personagens.find({}).toArray();
  const getPersonagemById = async (id) => personagens.findOne({ _id: ObjectId(id) });

  router.use(function (req, res, next) {
    next();
  });

  router.post("/", async (req, res) => {
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.status(400).send({
        error: "Requisição inválida, obrigatório os campos nome e imagemUrl",
      });
      return;
    }

    const result = await personagens.insertOne(objeto);

    if (result.acknowledged == false) {
      res.status(500).send({ error: "Ocorreu um erro" });
      return;
    }

    res.status(201).send(objeto);
  });
})();

module.exports = router;

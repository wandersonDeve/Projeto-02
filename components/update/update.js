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

  router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
        res.status(400).send({error:"Requisição inválida, certifique-se que tenha os campos nome e imagemUrl",});
        return;
    }

    const quantidadePersonagens = await personagens.countDocuments({_id: ObjectId(id),});

    if (quantidadePersonagens !== 1) {
        res.status(404).send({ error: "Personagem não encontrado" });
        return;
    }

    const result = await personagens.updateOne(
        {
            _id: ObjectId(id),
        },
        {
            $set: objeto,
        }
    );
 
    if (result.acknowledged == "undefined") {
        res.status(500).send({ error: "Ocorreu um erro ao atualizar o personagem" });
        return;
    }
    res.send(await getPersonagemById(id));
});
})();

module.exports = router;

const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const router = express.Router();

(async () => {
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;
  const dbName = process.env.DB_NAME;
  const dbHost = process.env.DB_HOST;

  const connectionString = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

  const options = {
    useUnifiedTopology: true,
  };

  const client = await mongodb.MongoClient.connect(connectionString, options);

  const db = client.db("Rick");
  const personagens = db.collection("rickrick");

  router.use((req, res, next) => next());

  router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const quantidadePersonagens = await personagens.countDocuments({
      _id: ObjectId(id),
    });

    if (quantidadePersonagens !== 1) {
      res.status(404).send({ error: "Personagem não encontrao" });
      return;
    }

    const result = await personagens.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount !== 1) {
      res
        .status(500)
        .send({ error: "Ocorreu um erro ao remover o personagem" });
      return;
    }

    res.send("Personagem excluido com sucesso");
  });
})();

module.exports = router;

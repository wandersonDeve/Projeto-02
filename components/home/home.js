const express = require("express");
const router = express.Router();

router.use((req, res, next) => next());

router.get("/", async (req, res) => {
	res.send({ info: "Bem vindo a integração de API com Front" });
});

module.exports = router;

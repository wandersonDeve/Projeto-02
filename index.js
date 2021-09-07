const express = require("express");
const home = require("./components/home/home");
const readAll = require("./components/read-all/read-all");
const readById = require("./components/read-by-id/read-by-id");
const create = require("./components/create/create");
const update = require("./components/update/update");
const del = require("./components/delete/delete");
require("dotenv").config();
require("express-async-errors");

const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;

app.use("/", home);
app.use("/personagens/all", readAll)
app.use("/personagens/single", readById);
app.use("/personagens/create", create);
app.use("/personagens/update", update);
app.use("/personagens/delete", del);

app.all("*", function (req, res) {
	res.status(404).send({ message: "Endpoint was not found" });
  });

app.use((error, req, res, next) => {
	res.status(error.status || 500).send({
	error: {
	status: error.status || 500,
	message: error.message || "Internal Server Error",
	},
});
});

app.listen(port, () => {
	console.info(`App rodando em http://localhost:${port}`);
});
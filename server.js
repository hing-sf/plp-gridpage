const express = require("express");
const app = express();
const cors = require("cors");
const tomoData = require('./client/data.json');

app.use(cors());

app.get("/api/data", (req, res) => {
	res.json( tomoData );
});

const port = 5000;
app.listen(port, () => {
	console.log(` Server port: ${port}`);
});

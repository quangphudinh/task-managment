const express = require("express");
require('dotenv').config();
const database = require("./config/database");

const routes = require("./routes/index.route");

database.connect(); // ket noi database

const app = express();
const port = process.env.PORT || 3000;

//Routes
routes(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
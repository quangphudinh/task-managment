const express = require("express");
require('dotenv').config();
const database = require("./config/database");
const bodyParser = require('body-parser')
//khac phuc loi k lay dc data tu FE
const cors = require('cors')
const routesApiVer1 = require("./api/v1/routes/index.route");

database.connect(); // ket noi database

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

// parse application/json
app.use(bodyParser.json())

//Routes
routesApiVer1(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
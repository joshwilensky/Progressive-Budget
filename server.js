require("dotenv").config()
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const PORT = 3000;
const app = express();

app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/budget", {
    useNewUrlParser: true,
    useFindAndModify: false
});

// ROUTES
app.use(require("./routes/api.js"));

// LISTENING ON PORT 3000
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
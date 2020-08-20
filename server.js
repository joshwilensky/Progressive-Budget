require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/workout"
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// ROUTES
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// LISTENING ON PORT 3000
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
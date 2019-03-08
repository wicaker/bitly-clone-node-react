const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const shorters = require("./routes/api/shorters");
const path = require("path")
require('dotenv').config()

//Body parser midleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connet to MongoDB
mongoose
  .connect(`mongodb://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@ds163014.mlab.com:63014/${process.env.MONGO_DB}`,
    { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Avoid Access-Control-Allow-Origin Error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //this allow all client with everything domain to access our api
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// serve static front end
app.use('/', express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/myurl', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/logout', function (req, res) {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Use Routes
app.use("/api/users", users);
app.use("", shorters);

const port = process.env.PORT || 5000; //process.env.PORT because we want to deploy to herouku or somethnig else

//connect to server
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

//connect with socket io, websocket protocol
const io = require("./socket").init(server);
io.on("connection", socket =>
  console.log("made socket connection, ", socket.id)
);

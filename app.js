const express = require('express');
const app = express();
const mongoose = require('mongoose');

const users = require('./routes/api/users');

//DB Config
const db = require('./config/keys').mongoURI;

//Connet to MongoDB
mongoose
  .connect(db)
  .then(()=>console.log('MongoDB Connected'))
  .catch(err => console.log(err));



//Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000 ; //process.env.PORT because we want to deploy to herouku or somethnig else
app.listen(port, ()=> console.log(`Server running on port ${port}`));
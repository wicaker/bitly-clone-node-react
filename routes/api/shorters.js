const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validUrl = require('valid-url');
const shortid = require('shortid');
const cheerio = require('cheerio');
const axios = require('axios');

//Connect to socket io
const io = require('../../socket');

// Load Shorter models
const Shorter = require('../../models/Shorter');

// Load Users models
const User = require('../../models/Users');

// Load Tracker models
const Tracker = require('../../models/Trackers');

// @route GET api/shorters
// @desc Get shorters url by current user
// @access Private
router.get('/api/shorters', passport.authenticate('jwt', {session : false}), (req, res) => {
  const errors = {};
  Shorter
    .find({ user: req.user.id })
    .then( shorter => {
      if(!shorter){
        errors.noShorter = 'There is no shorter url for this user';
        return res.status(404).json(errors);
      }
      res.json(shorter)
    })
    .catch(err => res.status(404).json(err));
    
});

// @route DELETE api/shorters/delete
// @desc DELETE shorters url by current user
// @access Private
router.delete('/api/shorters/delete/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
  Shorter
    .findById(req.params.id)
    .then( shorter => {
      shorter
        .remove()
        .then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});



// @route POST api/shorters
// @desc POST url to shorting
// @access Private
router.post('/api/shorters', passport.authenticate('jwt', {session : false}), (req, res) => {
  const { originalUrl } = req.body;
  const baseurl = req.headers.host;
  const urlCode = shortid.generate();
  if(!validUrl.isUri(originalUrl)){
    res.status(400).json({"message" : "Your URL is invalid !"})
  }
  else{
    Shorter
      .findOne({urlCode: urlCode})
      .then(urlcode => {
        if(urlcode){
          return res.status(400).json({"messange": "please generate again"}); //response if already
        }
        axios.get(req.body.originalUrl)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html); 
            const title= $('title').text();
            const newUrl = new Shorter({
              user: req.user,
              title: title,
              originalUrl : req.body.originalUrl,
              urlCode,
              shortUrl:baseurl+'/'+urlCode,
              totalClicks: 0
            })
            newUrl
              .save()
              .then(newUrl => res.json(newUrl)) //response
              .catch(err => console.log(err))
        });
      })
  }
});

// @route GET /:code
// @desc direct to original url
// @access Public
router.get("/:code", async (req, res) => {
  console.log(req.connection.remoteAddress);

  const urlCode = req.params.code;
  Shorter
      .findOne({urlCode: urlCode})
      .then(urlCode => {
        if(urlCode){
          const newUrlTrack = new Tracker({
            shortUrlId: urlCode,
            ipAdress:req.connection.remoteAddress,
            refferrerUrl:urlCode.shortUrl
          })
          newUrlTrack
            .save()
            .then(()=>console.log('success'))
            .catch(err => console.log(err));
          urlCode.set({ totalClicks: parseInt(urlCode.totalClicks || 0) + 1 })
          urlCode
            .save()
            .then(()=>console.log('success'))
          .catch(err => console.log(err));
          io.getIO().emit('shorter',urlCode)
          console.log('mantap');
          return res.redirect(urlCode.originalUrl);
        }
      })
});


module.exports = router;
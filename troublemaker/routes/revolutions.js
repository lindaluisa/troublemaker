const express = require('express');
const router = express.Router();

const Revolution = require('../models/revolutions');

/* GET create-rev */
router.get('/create-rev', (req, res, next) => {
  res.render('create-rev');
});

/* POST create-rev */
router.post('/create-rev', (req, res, next) => {
  const name = req.body.name;
  const date = req.body.date;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const molotovScale = req.body.molotovScale;
  const description = req.body.description;
  const creator = req.session.currentUser._id;
  const participants = [creator];
  const callToAction = req.body.callToAction;

  console.log('req.session.currentUser', creator);

  const newRev = new Revolution({
    name: name,
    date: date,
    location: {latitude: latitude, longitude: longitude},
    molotovScale: molotovScale,
    description: description,
    creator: creator,
    participants: participants,
    callToAction: callToAction
  });
  newRev.save()
    .then(() => {
      res.redirect('/revolutions');
    }).catch((err) => {
      throw new Error(err);
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();

const Revolution = require('../models/revolutions');

function checkIfParticipates (participantsArr, userId) {
  let isParticipant = false;
  if (participantsArr.length > 0) {
    if (participantsArr.indexOf(userId) !== -1) {
      isParticipant = true;
    }
  }
  return isParticipant;
};

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/user-location', (req, res, next) => {
  res.render('user-location');
});

router.post('/get-revolutions', (req, res, next) => {
  const userLat = req.body.userlat;
  const userLng = req.body.userlng;
  const stringLocation = req.body.stringLocation;
  if (userLat === '' || userLng === '') {
    const message = 'We need you to tell us where you are!! Think global, act LOCAL!!';
    return res.render('user-location', {message});
  }
  const userLocation = {
    stringLocation: stringLocation,
    type: 'Point',
    coordinates: [userLat, userLng]
  };

  req.session.userLocation = userLocation;
  console.log('Session user location: ', req.session.userLocation);

  res.redirect('revolutions');
});

router.use((req, res, next) => {
  if (req.session.userLocation) {
    next();
  } else {
    res.redirect('/user-location');
  }
});

router.get('/revolution-details/:revolutionId', (req, res, next) => {
  const revolutionId = req.params.revolutionId;
  Revolution.findOne({'_id': revolutionId})
    .populate('creator')
    .then((result) => {
      const data = {
        revolution: result,
        isParticipant: checkIfParticipates(result.participants, req.session.currentUser._id)
      };
      console.log('revolution.participants: ', result.participants);
      return data;
    })
    .then((data) => {
      res.render('revolution-details', data);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/leave/:revolutionId', (req, res, next) => {
  const revolutionId = req.params.revolutionId;
  Revolution.findOneAndUpdate({'_id': revolutionId}, { $pull: { participants: req.session.currentUser._id } }, {new: true})
    .then((revolution) => {
      const data = {
        revolution: revolution,
        isParticipant: checkIfParticipates(revolution.participants, req.session.currentUser._id)
      };
      res.render('revolution-details', data);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/join/:revolutionId', (req, res, next) => {
  const revolutionId = req.params.revolutionId;
  Revolution.findOneAndUpdate({'_id': revolutionId}, { $push: { participants: req.session.currentUser._id } }, {new: true})
    .populate('creator')
    .then((revolution) => {
      const data = {
        revolution: revolution,
        isParticipant: checkIfParticipates(revolution.participants, req.session.currentUser._id)
      };
      res.render('revolution-details', data);
    })
    .catch((err) => {
      next(err);
    });
});

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
  const callToAction = req.body.call;

  console.log('req.session.currentUser', creator);
  if (name === '' || latitude === '' || longitude === '' || molotovScale === '' || description === '' || callToAction === '') {
    const message = 'All fields are required';
    return res.render('create-rev', {message});
  }

  const newRev = new Revolution({
    name: name,
    date: date,

    location: {
      type: 'Point',
      coordinates: [latitude, longitude]
    },
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

// arg results are the results of find function (dbs)
router.get('/revolutions', (req, res, next) => {
  Revolution.find({}).populate('creator').then((results) => {
    return results.map((result) => {
      result.description = result.description.substring(0, 200) + '...';
      return result;
    });
  })
    .then((results) => {
      return results.filter((result) => {
        return result.date.getTime() >= Date.now();
      });
    })
    .then((revolutions) => {
      res.render('revolutions', {revolutions});
    });
});

module.exports = router;

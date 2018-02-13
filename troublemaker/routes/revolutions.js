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

function getDistanceLatLng (lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad (deg) {
  return deg * (Math.PI / 180);
}

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
        isParticipant: checkIfParticipates(result.participants, req.session.currentUser._id),
        userLocation: req.session.userLocation
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
        isParticipant: checkIfParticipates(revolution.participants, req.session.currentUser._id),
        userLocation: req.session.userLocation
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
        isParticipant: checkIfParticipates(revolution.participants, req.session.currentUser._id),
        userLocation: req.session.userLocation
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
  const address = req.body.address;
  const latitude = req.body.revlat;
  const longitude = req.body.revlng;
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
    address: address,
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
      next(err);
    });
});

// arg results are the results of find function (dbs)
router.get('/revolutions', (req, res, next) => {
  Revolution.find({}).populate('creator')
    .then((results) => {
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
      return revolutions.filter((revolution) => {
        const revolutionLat = revolution.location.coordinates[0];
        const revolutionLng = revolution.location.coordinates[1];
        const userLat = req.session.userLocation.coordinates[0];
        const userLng = req.session.userLocation.coordinates[1];
        const distance = getDistanceLatLng(revolutionLat, revolutionLng, userLat, userLng);
        return distance < 100;
      });
    })
    .then((revolutions) => {
      const data = {
        revolutions: revolutions,
        userLocation: req.session.userLocation
      };
      res.render('revolutions', data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

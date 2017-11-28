'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hometext = mongoose.model('Hometext'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create Hometext
 */
exports.create = function (req, res) {
  var hometext = new Hometext(req.body);
  hometext.user = req.user;

  hometext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hometext);
    }
  });
};

/**
 * Show the current hometext
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var hometext = req.hometext ? req.hometext.toJSON() : {};

  // Add a custom field to the Hometext, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Hometext model.
  hometext.isCurrentUserOwner = !!(req.user && hometext.user && hometext.user._id.toString() === req.user._id.toString());

  res.json(hometext);
};

/**
 * Update hometext
 */
exports.update = function (req, res) {
  var hometext = req.hometext;


  hometext.bannerText = req.body.bannerText;
  hometext.parallaxCapt1 = req.body.parallaxCapt1;
  hometext.heading1 = req.body.heading1;
  hometext.heading2 = req.body.heading2;
  hometext.mainText1 = req.body.mainText1;
  hometext.parallaxCapt2 = req.body.parallaxCapt2;
  hometext.releasesHeading = req.body.releasesHeading;
  hometext.releasesText = req.body.releasesText;


  hometext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hometext);
    }
  });
};

/**
 * Delete hometext
 */
exports.delete = function (req, res) {
  var hometext = req.hometext;

  hometext.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hometext);
    }
  });
};

/**
 * List of Hometexts
 */
exports.list = function (req, res) {
  Hometext.find().sort('-created').populate('user', 'displayName').exec(function (err, hometexts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hometexts);
    }
  });
};

/**
 * Hometext middleware
 */
exports.hometextByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hometext is invalid'
    });
  }

  Hometext.findById(id).populate('user', 'displayName').exec(function (err, hometext) {
    if (err) {
      return next(err);
    } else if (!hometext) {
      return res.status(404).send({
        message: 'No hometext with that identifier has been found'
      });
    }
    req.hometext = hometext;
    next();
  });
};

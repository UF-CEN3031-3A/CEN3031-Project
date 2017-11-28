'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Publictext = mongoose.model('Publictext'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create Publictext
 */
exports.create = function (req, res) {
  var publictext = new Publictext(req.body);
  publictext.user = req.user;

  publictext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(publictext);
    }
  });
};

/**
 * Show the current publictext
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var publictext = req.publictext ? req.publictext.toJSON() : {};

  // Add a custom field to the Publictext, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Publictext model.
  publictext.isCurrentUserOwner = !!(req.user && publictext.user && publictext.user._id.toString() === req.user._id.toString());

  res.json(publictext);
};

/**
 * Update publictext
 */
exports.update = function (req, res) {
  var publictext = req.publictext;

  publictext.parallaxCapt1 = req.body.parallaxCapt1;
  publictext.heading1 = req.body.heading1;
  publictext.shortText1 = req.body.shortText1;
  publictext.parallaxCapt2 = req.body.parallaxCapt2;
  publictext.heading2 = req.body.heading2;
  publictext.shortText2 = req.body.shortText2;
  publictext.parallaxCapt3 = req.body.parallaxCapt3;
  publictext.heading3 = req.body.heading3;
  publictext.shortText3 = req.body.shortText3;


  publictext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(publictext);
    }
  });
};

/**
 * Delete publictext
 */
exports.delete = function (req, res) {
  var publictext = req.publictext;

  publictext.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(publictext);
    }
  });
};

/**
 * List of Publictexts
 */
exports.list = function (req, res) {
  Publictext.find().sort('-created').populate('user', 'displayName').exec(function (err, publictexts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(publictexts);
    }
  });
};

/**
 * Publictext middleware
 */
exports.publictextByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Publictext is invalid'
    });
  }

  Publictext.findById(id).populate('user', 'displayName').exec(function (err, publictext) {
    if (err) {
      return next(err);
    } else if (!publictext) {
      return res.status(404).send({
        message: 'No publictext with that identifier has been found'
      });
    }
    req.publictext = publictext;
    next();
  });
};

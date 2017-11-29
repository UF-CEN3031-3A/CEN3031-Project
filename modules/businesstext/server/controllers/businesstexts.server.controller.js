'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Businesstext = mongoose.model('Businesstext'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create Businesstext
 */
exports.create = function (req, res) {
  var businesstext = new Businesstext(req.body);
  businesstext.user = req.user;

  businesstext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(businesstext);
    }
  });
};

/**
 * Show the current businesstext
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var businesstext = req.businesstext ? req.businesstext.toJSON() : {};

  // Add a custom field to the Businesstext, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Businesstext model.
  businesstext.isCurrentUserOwner = !!(req.user && businesstext.user && businesstext.user._id.toString() === req.user._id.toString());

  res.json(businesstext);
};

/**
 * Update businesstext
 */
exports.update = function (req, res) {
  var businesstext = req.businesstext;

  businesstext.parallaxCapt1 = req.body.parallaxCapt1;
  businesstext.heading1 = req.body.heading1;
  businesstext.shortText1 = req.body.shortText1;
  businesstext.parallaxCapt2 = req.body.parallaxCapt2;
  businesstext.heading2 = req.body.heading2;
  businesstext.shortText2 = req.body.shortText2;

  businesstext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(businesstext);
    }
  });
};

/**
 * Delete businesstext
 */
exports.delete = function (req, res) {
  var businesstext = req.businesstext;

  businesstext.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(businesstext);
    }
  });
};

/**
 * List of Businesstexts
 */
exports.list = function (req, res) {
  Businesstext.find().sort('-created').populate('user', 'displayName').exec(function (err, businesstexts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(businesstexts);
    }
  });
};

/**
 * Businesstext middleware
 */
exports.businesstextByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Businesstext is invalid'
    });
  }

  Businesstext.findById(id).populate('user', 'displayName').exec(function (err, businesstext) {
    if (err) {
      return next(err);
    } else if (!businesstext) {
      return res.status(404).send({
        message: 'No businesstext with that identifier has been found'
      });
    }
    req.businesstext = businesstext;
    next();
  });
};

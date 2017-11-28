'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Abouttext = mongoose.model('Abouttext'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create Abouttext
 */
exports.create = function (req, res) {
  var abouttext = new Abouttext(req.body);
  abouttext.user = req.user;

  abouttext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(abouttext);
    }
  });
};

/**
 * Show the current abouttext
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var abouttext = req.abouttext ? req.abouttext.toJSON() : {};

  // Add a custom field to the Abouttext, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Abouttext model.
  abouttext.isCurrentUserOwner = !!(req.user && abouttext.user && abouttext.user._id.toString() === req.user._id.toString());

  res.json(abouttext);
};

/**
 * Update abouttext
 */
exports.update = function (req, res) {
  var abouttext = req.abouttext;


  abouttext.parallaxCapt1 = req.body.parallaxCapt1;
  abouttext.heading1 = req.body.heading1;
  abouttext.shortText1 = req.body.shortText1;
  abouttext.parallaxCapt2 = req.body.parallaxCapt2;
  abouttext.heading2 = req.body.heading2;
  abouttext.shortText2 = req.body.shortText2;
  abouttext.parallaxCapt3 = req.body.parallaxCapt3;
  abouttext.heading3 = req.body.heading3;
  abouttext.shortText3 = req.body.shortText3;

  abouttext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(abouttext);
    }
  });
};

/**
 * Delete abouttext
 */
exports.delete = function (req, res) {
  var abouttext = req.abouttext;

  abouttext.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(abouttext);
    }
  });
};

/**
 * List of Abouttexts
 */
exports.list = function (req, res) {
  Abouttext.find().sort('-created').populate('user', 'displayName').exec(function (err, abouttexts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(abouttexts);
    }
  });
};

/**
 * Abouttext middleware
 */
exports.abouttextByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Abouttext is invalid'
    });
  }

  Abouttext.findById(id).populate('user', 'displayName').exec(function (err, abouttext) {
    if (err) {
      return next(err);
    } else if (!abouttext) {
      return res.status(404).send({
        message: 'No abouttext with that identifier has been found'
      });
    }
    req.abouttext = abouttext;
    next();
  });
};

'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  About = mongoose.model('About'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an about
 */
exports.create = function (req, res) {
  var about = new About(req.body);
  about.user = req.user;
  console.log(about);
  about.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(about);
    }
  });
};

/**
 * Show the current about
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var about = req.about ? req.about.toJSON() : {};

  // Add a custom field to the About, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the About model.
  about.isCurrentUserOwner = !!(req.user && about.user && about.user._id.toString() === req.user._id.toString());

  res.json(about);
};

/**
 * Update an about
 */
exports.update = function (req, res) {
  var about = req.about;

  about.title = req.body.title;
  about.content = req.body.content;
  about.image = req.body.image;
  console.log(req.body);


  about.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(about);
    }
  });
};

/**
 * Delete an about
 */
exports.delete = function (req, res) {
  var about = req.about;

  about.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(about);
    }
  });
};

/**
 * List of Abouts
 */
exports.list = function (req, res) {
  About.find().sort('-created').populate('user', 'displayName').exec(function (err, abouts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(abouts);
    }
  });
};

/**
 * About middleware
 */
exports.aboutByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'About is invalid'
    });
  }

  About.findById(id).populate('about', 'title').exec(function (err, about) {
    if (err) {
      return next(err);
    } else if (!about) {
      return res.status(404).send({
        message: 'No about with that identifier has been found'
      });
    }
    req.about = about;
    next();
  });
};

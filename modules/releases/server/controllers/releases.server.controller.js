'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Release = mongoose.model('Release'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an release
 */
exports.create = function (req, res) {
  var release = new Release(req.body);
  release.user = req.user;

  release.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(release);
    }
  });
};

/**
 * Show the current release
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var release = req.release ? req.release.toJSON() : {};

  // Add a custom field to the Release, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Release model.
  release.isCurrentUserOwner = !!(req.user && release.user && release.user._id.toString() === req.user._id.toString());

  res.json(release);
};

/**
 * Update an release
 */
exports.update = function (req, res) {
  var release = req.release;

  release.title = req.body.title;
  release.content = req.body.content;

  release.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(release);
    }
  });
};

/**
 * Delete an release
 */
exports.delete = function (req, res) {
  var release = req.release;

  release.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(release);
    }
  });
};

/**
 * List of Releases
 */
exports.list = function (req, res) {
  Release.find().sort('-created').populate('user', 'displayName').exec(function (err, releases) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(releases);
    }
  });
};

/**
 * Release middleware
 */
exports.releaseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Release is invalid'
    });
  }

  Release.findById(id).populate('user', 'displayName').exec(function (err, release) {
    if (err) {
      return next(err);
    } else if (!release) {
      return res.status(404).send({
        message: 'No release with that identifier has been found'
      });
    }
    req.release = release;
    next();
  });
};

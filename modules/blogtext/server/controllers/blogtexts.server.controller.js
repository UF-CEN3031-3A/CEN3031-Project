'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Blogtext = mongoose.model('Blogtext'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create Blogtext
 */
exports.create = function (req, res) {
  var blogtext = new Blogtext(req.body);
  blogtext.user = req.user;

  blogtext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogtext);
    }
  });
};

/**
 * Show the current blogtext
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var blogtext = req.blogtext ? req.blogtext.toJSON() : {};

  // Add a custom field to the Blogtext, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Blogtext model.
  blogtext.isCurrentUserOwner = !!(req.user && blogtext.user && blogtext.user._id.toString() === req.user._id.toString());

  res.json(blogtext);
};

/**
 * Update blogtext
 */
exports.update = function (req, res) {
  var blogtext = req.blogtext;

  blogtext.parallaxCapt1 = req.body.parallaxCapt1;
  blogtext.heading1 = req.body.heading1;
  blogtext.shortText1 = req.body.shortText1;

  blogtext.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogtext);
    }
  });
};

/**
 * Delete blogtext
 */
exports.delete = function (req, res) {
  var blogtext = req.blogtext;

  blogtext.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogtext);
    }
  });
};

/**
 * List of Blogtexts
 */
exports.list = function (req, res) {
  Blogtext.find().sort('-created').populate('user', 'displayName').exec(function (err, blogtexts) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(blogtexts);
    }
  });
};

/**
 * Blogtext middleware
 */
exports.blogtextByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Blogtext is invalid'
    });
  }

  Blogtext.findById(id).populate('user', 'displayName').exec(function (err, blogtext) {
    if (err) {
      return next(err);
    } else if (!blogtext) {
      return res.status(404).send({
        message: 'No blogtext with that identifier has been found'
      });
    }
    req.blogtext = blogtext;
    next();
  });
};

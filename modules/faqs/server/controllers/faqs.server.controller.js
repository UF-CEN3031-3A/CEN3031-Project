'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Faq = mongoose.model('Faq'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an faq
 */
exports.create = function (req, res) {
  var faq = new Faq(req.body);
  faq.user = req.user;

  faq.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(faq);
    }
  });
};

/**
 * Show the current faq
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var faq = req.faq ? req.faq.toJSON() : {};

  // Add a custom field to the Faq, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Faq model.
  faq.isCurrentUserOwner = !!(req.user && faq.user && faq.user._id.toString() === req.user._id.toString());

  res.json(faq);
};

/**
 * Update an faq
 */
exports.update = function (req, res) {
  var faq = req.faq;

  faq.title = req.body.title;
  faq.content = req.body.content;

  faq.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(faq);
    }
  });
};

/**
 * Delete an faq
 */
exports.delete = function (req, res) {
  var faq = req.faq;

  faq.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(faq);
    }
  });
};

/**
 * List of Faqs
 */
exports.list = function (req, res) {
  Faq.find().sort('-created').populate('user', 'displayName').exec(function (err, faqs) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(faqs);
    }
  });
};

/**
 * Faq middleware
 */
exports.faqByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Faq is invalid'
    });
  }

  Faq.findById(id).populate('user', 'displayName').exec(function (err, faq) {
    if (err) {
      return next(err);
    } else if (!faq) {
      return res.status(404).send({
        message: 'No faq with that identifier has been found'
      });
    }
    req.faq = faq;
    next();
  });
};

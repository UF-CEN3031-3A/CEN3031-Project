'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Hometext Schema
 */
var HometextSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  parallaxCapt0: {
    type: String,
    default: '',
    trim: true,
    required: 'Parallax cannot be blank'
  },
  parallaxCapt1: {
    type: String,
    default: '',
    trim: true,
    required: 'Parallax cannot be blank'
  },
  heading1: {
    type: String,
    default: '',
    trim: true,
    required: 'Heading cannot be blank'
  },
  heading2: {
    type: String,
    default: '',
    trim: true
  },
  mainText1: {
    type: String,
    default: '',
    trim: true,
    required: 'Main Text cannot be blank'
  },
  parallaxCapt2: {
    type: String,
    default: '',
    trim: true,
    required: 'Parallax cannot be blank'
  },
  releasesHeading: {
    type: String,
    default: '',
    trim: true,
    required: 'Releases Heading cannot be blank'
  },
  releasesText: {
    type: String,
    default: '',
    trim: true,
    required: 'Releases Text cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

HometextSchema.statics.seed = seed;

mongoose.model('Hometext', HometextSchema);

/**
* Seeds the User collection with document (Hometext)
* and provided options.
*/
function seed(doc, options) {
  var Hometext = mongoose.model('Hometext');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Hometext
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Hometext (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Hometext\t' + doc.title + ' skipped')
          });
        }

        var hometext = new Hometext(doc);

        hometext.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Hometext\t' + hometext.title + ' added'
          });
        });
      });
    }
  });
}

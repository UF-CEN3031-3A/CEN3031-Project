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
 * Businesstext Schema
 */
var BusinesstextSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
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
  shortText1: {
    type: String,
    default: '',
    trim: true,
    required: 'Short Text cannot be blank'
  },
  parallaxCapt2: {
    type: String,
    default: '',
    trim: true,
    required: 'Parallax cannot be blank'
  },
  heading2: {
    type: String,
    default: '',
    trim: true,
    required: 'Heading cannot be blank'
  },
  shortText2: {
    type: String,
    default: '',
    trim: true,
    required: 'Short Text cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

BusinesstextSchema.statics.seed = seed;

mongoose.model('Businesstext', BusinesstextSchema);

/**
* Seeds the User collection with document (Businesstext)
* and provided options.
*/
function seed(doc, options) {
  var Businesstext = mongoose.model('Businesstext');

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
        Businesstext
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

            // Remove Businesstext (overwrite)

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
            message: chalk.yellow('Database Seeding: Businesstext\t' + doc.title + ' skipped')
          });
        }

        var businesstext = new Businesstext(doc);

        businesstext.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Businesstext\t' + businesstext.title + ' added'
          });
        });
      });
    }
  });
}

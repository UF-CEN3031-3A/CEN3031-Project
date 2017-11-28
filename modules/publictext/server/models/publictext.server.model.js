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
 * Publictext Schema
 */
var PublictextSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  parallaxCapt1: {
    type: String,
    default: '',
    trim: true,
    required: 'Source cannot be blank'
  },
  heading1: {
    type: String,
    default: '',
    trim: true,
    required: 'Author cannot be blank'
  },
  shortText1: {
    type: String,
    default: '',
    trim: true,
    required: 'Author cannot be blank'
  },
  parallaxCapt2: {
    type: String,
    default: '',
    trim: true,
    required: 'Source cannot be blank'
  },
  heading2: {
    type: String,
    default: '',
    trim: true
  },
  shortText2: {
    type: String,
    default: '',
    trim: true,
    required: 'Author cannot be blank'
  },
  parallaxCapt3: {
    type: String,
    default: '',
    trim: true,
    required: 'Source cannot be blank'
  },
  heading3: {
    type: String,
    default: '',
    trim: true
  },
  shortText3: {
    type: String,
    default: '',
    trim: true,
    required: 'Author cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

PublictextSchema.statics.seed = seed;

mongoose.model('Publictext', PublictextSchema);

/**
* Seeds the User collection with document (Publictext)
* and provided options.
*/
function seed(doc, options) {
  var Publictext = mongoose.model('Publictext');

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
        Publictext
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

            // Remove Publictext (overwrite)

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
            message: chalk.yellow('Database Seeding: Publictext\t' + doc.title + ' skipped')
          });
        }

        var publictext = new Publictext(doc);

        publictext.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Publictext\t' + publictext.title + ' added'
          });
        });
      });
    }
  });
}

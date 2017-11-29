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
 * Blogtext Schema
 */
var BlogtextSchema = new Schema({
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

BlogtextSchema.statics.seed = seed;

mongoose.model('Blogtext', BlogtextSchema);

/**
* Seeds the User collection with document (Blogtext)
* and provided options.
*/
function seed(doc, options) {
  var Blogtext = mongoose.model('Blogtext');

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
        Blogtext
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

            // Remove Blogtext (overwrite)

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
            message: chalk.yellow('Database Seeding: Blogtext\t' + doc.title + ' skipped')
          });
        }

        var blogtext = new Blogtext(doc);

        blogtext.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Blogtext\t' + blogtext.title + ' added'
          });
        });
      });
    }
  });
}

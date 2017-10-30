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

  About.findById(id).populate('user', 'displayName').exec(function (err, about) {
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

/**
 * Update profile picture
 */
exports.changeAboutPicture = function (req, res) {
  var about = req.about;
  var existingImageUrl;
  var multerConfig;

  multerConfig = config.uploads.profile.image;

  // Filtering to upload only images
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  var upload = multer(multerConfig).single('newAboutPicture');

  existingImageUrl = about.profileImageURL;
  uploadImage()
    .then(updateAbout)
    .then(deleteOldImage)
    .then(login)
    .then(function () {
      res.json(about);
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateAbout() {
    return new Promise(function (resolve, reject) {
      about.profileImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
        req.file.location :
        '/' + req.file.path;
      about.save(function (err, theabout) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== About.schema.path('aboutImageURL').defaultValue) {
        if (useS3Storage) {
          try {
            var { region, bucket, key } = amazonS3URI(existingImageUrl);
            var params = {
              Bucket: config.aws.s3.bucket,
              Key: key
            };

            s3.deleteObject(params, function (err) {
              if (err) {
                console.log('Error occurred while deleting old profile picture.');
                console.log('Check if you have sufficient permissions : ' + err);
              }

              resolve();
            });
          } catch (err) {
            console.warn(`${existingImageUrl} is not a valid S3 uri`);

            return resolve();
          }
        } else {
          fs.unlink(path.resolve('.' + existingImageUrl), function (unlinkError) {
            if (unlinkError) {

              // If file didn't exist, no need to reject promise
              if (unlinkError.code === 'ENOENT') {
                console.log('Removing profile image failed because file did not exist.');
                return resolve();
              }

              console.error(unlinkError);

              reject({
                message: 'Error occurred while deleting old profile picture'
              });
            } else {
              resolve();
            }
          });
        }
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise(function (resolve, reject) {
      req.login(about, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

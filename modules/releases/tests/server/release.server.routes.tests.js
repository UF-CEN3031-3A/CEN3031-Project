'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Release = mongoose.model('Release'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  release;

/**
 * Release routes tests
 */
describe('Release CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new release
    user.save()
      .then(function () {
        release = {
          title: 'Release Title',
          content: 'Release Content'
        };

        done();
      })
      .catch(done);
  });
  
  it('should not be able to save an release if not logged in', function (done) {
    agent.post('/api/releases')
      .send(release)
      .expect(403)
      .end(function (releaseSaveErr, releaseSaveRes) {
        // Call the assertion callback
        done(releaseSaveErr);
      });
  });

  it('should be able to get a list of releases if not signed in', function (done) {
    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      // Request releases
      agent.get('/api/releases')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single release if not signed in', function (done) {
    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      agent.get('/api/releases/' + releaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', release.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single release with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/releases/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Release is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single release which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent release
    agent.get('/api/releases/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No release with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an release if not signed in', function (done) {
    // Set release user
    release.user = user;

    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      // Try deleting release
      agent.delete('/api/releases/' + releaseObj._id)
        .expect(403)
        .end(function (releaseDeleteErr, releaseDeleteRes) {
          // Set message assertion
          (releaseDeleteRes.body.message).should.match('User is not authorized');

          // Handle release error error
          done(releaseDeleteErr);
        });

    });
  });

  it('should be able to get a single release that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new release
          agent.post('/api/releases')
            .send(release)
            .expect(200)
            .end(function (releaseSaveErr, releaseSaveRes) {
              // Handle release save error
              if (releaseSaveErr) {
                return done(releaseSaveErr);
              }

              // Set assertions on new release
              (releaseSaveRes.body.title).should.equal(release.title);
              should.exist(releaseSaveRes.body.user);
              should.equal(releaseSaveRes.body.user._id, orphanId);

              // force the release to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the release
                    agent.get('/api/releases/' + releaseSaveRes.body._id)
                      .expect(200)
                      .end(function (releaseInfoErr, releaseInfoRes) {
                        // Handle release error
                        if (releaseInfoErr) {
                          return done(releaseInfoErr);
                        }

                        // Set assertions
                        (releaseInfoRes.body._id).should.equal(releaseSaveRes.body._id);
                        (releaseInfoRes.body.title).should.equal(release.title);
                        should.equal(releaseInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single release if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/releases/' + releaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', release.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single release, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'releaseowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Release
    var _releaseOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _releaseOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Release
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new release
          agent.post('/api/releases')
            .send(release)
            .expect(200)
            .end(function (releaseSaveErr, releaseSaveRes) {
              // Handle release save error
              if (releaseSaveErr) {
                return done(releaseSaveErr);
              }

              // Set assertions on new release
              (releaseSaveRes.body.title).should.equal(release.title);
              should.exist(releaseSaveRes.body.user);
              should.equal(releaseSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the release
                  agent.get('/api/releases/' + releaseSaveRes.body._id)
                    .expect(200)
                    .end(function (releaseInfoErr, releaseInfoRes) {
                      // Handle release error
                      if (releaseInfoErr) {
                        return done(releaseInfoErr);
                      }

                      // Set assertions
                      (releaseInfoRes.body._id).should.equal(releaseSaveRes.body._id);
                      (releaseInfoRes.body.title).should.equal(release.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (releaseInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Release.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});

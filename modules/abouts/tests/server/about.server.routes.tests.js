'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  About = mongoose.model('About'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  about;

/**
 * About routes tests
 */
describe('About CRUD tests', function () {

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

    // Save a user to the test db and create new about
    user.save()
      .then(function () {
        about = {
          title: 'About Title',
          content: 'About Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an about if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/abouts')
          .send(about)
          .expect(403)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Call the assertion callback
            done(aboutSaveErr);
          });

      });
  });

  it('should not be able to save an about if not logged in', function (done) {
    agent.post('/api/abouts')
      .send(about)
      .expect(403)
      .end(function (aboutSaveErr, aboutSaveRes) {
        // Call the assertion callback
        done(aboutSaveErr);
      });
  });

  it('should not be able to update an about if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/abouts')
          .send(about)
          .expect(403)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Call the assertion callback
            done(aboutSaveErr);
          });
      });
  });

  it('should be able to get a list of abouts if not signed in', function (done) {
    // Create new about model instance
    var aboutObj = new About(about);

    // Save the about
    aboutObj.save(function () {
      // Request abouts
      agent.get('/api/abouts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single about if not signed in', function (done) {
    // Create new about model instance
    var aboutObj = new About(about);

    // Save the about
    aboutObj.save(function () {
      agent.get('/api/abouts/' + aboutObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', about.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single about with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/abouts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'About is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single about which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent about
    agent.get('/api/abouts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No about with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an about if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/abouts')
          .send(about)
          .expect(403)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Call the assertion callback
            done(aboutSaveErr);
          });
      });
  });

  it('should not be able to delete an about if not signed in', function (done) {
    // Set about user
    about.user = user;

    // Create new about model instance
    var aboutObj = new About(about);

    // Save the about
    aboutObj.save(function () {
      // Try deleting about
      agent.delete('/api/abouts/' + aboutObj._id)
        .expect(403)
        .end(function (aboutDeleteErr, aboutDeleteRes) {
          // Set message assertion
          (aboutDeleteRes.body.message).should.match('User is not authorized');

          // Handle about error error
          done(aboutDeleteErr);
        });

    });
  });

  it('should be able to get a single about that has an orphaned user reference', function (done) {
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

          // Save a new about
          agent.post('/api/abouts')
            .send(about)
            .expect(200)
            .end(function (aboutSaveErr, aboutSaveRes) {
              // Handle about save error
              if (aboutSaveErr) {
                return done(aboutSaveErr);
              }

              // Set assertions on new about
              (aboutSaveRes.body.title).should.equal(about.title);
              should.exist(aboutSaveRes.body.user);
              should.equal(aboutSaveRes.body.user._id, orphanId);

              // force the about to have an orphaned user reference
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

                    // Get the about
                    agent.get('/api/abouts/' + aboutSaveRes.body._id)
                      .expect(200)
                      .end(function (aboutInfoErr, aboutInfoRes) {
                        // Handle about error
                        if (aboutInfoErr) {
                          return done(aboutInfoErr);
                        }

                        // Set assertions
                        (aboutInfoRes.body._id).should.equal(aboutSaveRes.body._id);
                        (aboutInfoRes.body.title).should.equal(about.title);
                        should.equal(aboutInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single about if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new about model instance
    var aboutObj = new About(about);

    // Save the about
    aboutObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/abouts/' + aboutObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', about.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single about, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'aboutowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the About
    var _aboutOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _aboutOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the About
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

          // Save a new about
          agent.post('/api/abouts')
            .send(about)
            .expect(200)
            .end(function (aboutSaveErr, aboutSaveRes) {
              // Handle about save error
              if (aboutSaveErr) {
                return done(aboutSaveErr);
              }

              // Set assertions on new about
              (aboutSaveRes.body.title).should.equal(about.title);
              should.exist(aboutSaveRes.body.user);
              should.equal(aboutSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the about
                  agent.get('/api/abouts/' + aboutSaveRes.body._id)
                    .expect(200)
                    .end(function (aboutInfoErr, aboutInfoRes) {
                      // Handle about error
                      if (aboutInfoErr) {
                        return done(aboutInfoErr);
                      }

                      // Set assertions
                      (aboutInfoRes.body._id).should.equal(aboutSaveRes.body._id);
                      (aboutInfoRes.body.title).should.equal(about.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (aboutInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    About.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});

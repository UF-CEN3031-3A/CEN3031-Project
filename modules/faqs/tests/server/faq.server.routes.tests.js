'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Faq = mongoose.model('Faq'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  faq;

/**
 * Faq routes tests
 */
describe('Faq CRUD tests', function () {

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

    // Save a user to the test db and create new faq
    user.save()
      .then(function () {
        faq = {
          title: 'Faq Title',
          content: 'Faq Content'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save an faq if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/faqs')
          .send(faq)
          .expect(403)
          .end(function (faqSaveErr, faqSaveRes) {
            // Call the assertion callback
            done(faqSaveErr);
          });

      });
  });

  it('should not be able to save an faq if not logged in', function (done) {
    agent.post('/api/faqs')
      .send(faq)
      .expect(403)
      .end(function (faqSaveErr, faqSaveRes) {
        // Call the assertion callback
        done(faqSaveErr);
      });
  });

  it('should not be able to update an faq if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/faqs')
          .send(faq)
          .expect(403)
          .end(function (faqSaveErr, faqSaveRes) {
            // Call the assertion callback
            done(faqSaveErr);
          });
      });
  });

  it('should be able to get a list of faqs if not signed in', function (done) {
    // Create new faq model instance
    var faqObj = new Faq(faq);

    // Save the faq
    faqObj.save(function () {
      // Request faqs
      agent.get('/api/faqs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single faq if not signed in', function (done) {
    // Create new faq model instance
    var faqObj = new Faq(faq);

    // Save the faq
    faqObj.save(function () {
      agent.get('/api/faqs/' + faqObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', faq.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single faq with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/faqs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Faq is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single faq which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent faq
    agent.get('/api/faqs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No faq with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an faq if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/faqs')
          .send(faq)
          .expect(403)
          .end(function (faqSaveErr, faqSaveRes) {
            // Call the assertion callback
            done(faqSaveErr);
          });
      });
  });

  it('should not be able to delete an faq if not signed in', function (done) {
    // Set faq user
    faq.user = user;

    // Create new faq model instance
    var faqObj = new Faq(faq);

    // Save the faq
    faqObj.save(function () {
      // Try deleting faq
      agent.delete('/api/faqs/' + faqObj._id)
        .expect(403)
        .end(function (faqDeleteErr, faqDeleteRes) {
          // Set message assertion
          (faqDeleteRes.body.message).should.match('User is not authorized');

          // Handle faq error error
          done(faqDeleteErr);
        });

    });
  });

  it('should be able to get a single faq that has an orphaned user reference', function (done) {
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

          // Save a new faq
          agent.post('/api/faqs')
            .send(faq)
            .expect(200)
            .end(function (faqSaveErr, faqSaveRes) {
              // Handle faq save error
              if (faqSaveErr) {
                return done(faqSaveErr);
              }

              // Set assertions on new faq
              (faqSaveRes.body.title).should.equal(faq.title);
              should.exist(faqSaveRes.body.user);
              should.equal(faqSaveRes.body.user._id, orphanId);

              // force the faq to have an orphaned user reference
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

                    // Get the faq
                    agent.get('/api/faqs/' + faqSaveRes.body._id)
                      .expect(200)
                      .end(function (faqInfoErr, faqInfoRes) {
                        // Handle faq error
                        if (faqInfoErr) {
                          return done(faqInfoErr);
                        }

                        // Set assertions
                        (faqInfoRes.body._id).should.equal(faqSaveRes.body._id);
                        (faqInfoRes.body.title).should.equal(faq.title);
                        should.equal(faqInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single faq if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new faq model instance
    var faqObj = new Faq(faq);

    // Save the faq
    faqObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/faqs/' + faqObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', faq.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single faq, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'faqowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Faq
    var _faqOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _faqOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Faq
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

          // Save a new faq
          agent.post('/api/faqs')
            .send(faq)
            .expect(200)
            .end(function (faqSaveErr, faqSaveRes) {
              // Handle faq save error
              if (faqSaveErr) {
                return done(faqSaveErr);
              }

              // Set assertions on new faq
              (faqSaveRes.body.title).should.equal(faq.title);
              should.exist(faqSaveRes.body.user);
              should.equal(faqSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the faq
                  agent.get('/api/faqs/' + faqSaveRes.body._id)
                    .expect(200)
                    .end(function (faqInfoErr, faqInfoRes) {
                      // Handle faq error
                      if (faqInfoErr) {
                        return done(faqInfoErr);
                      }

                      // Set assertions
                      (faqInfoRes.body._id).should.equal(faqSaveRes.body._id);
                      (faqInfoRes.body.title).should.equal(faq.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (faqInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    Faq.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});

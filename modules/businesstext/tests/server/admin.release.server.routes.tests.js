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
describe('Release Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an release if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Get a list of releases
            agent.get('/api/releases')
              .end(function (releasesGetErr, releasesGetRes) {
                // Handle release save error
                if (releasesGetErr) {
                  return done(releasesGetErr);
                }

                // Get releases list
                var releases = releasesGetRes.body;

                // Set assertions
                (releases[0].user._id).should.equal(userId);
                (releases[0].title).should.match('Release Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an release if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Update release title
            release.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing release
            agent.put('/api/releases/' + releaseSaveRes.body._id)
              .send(release)
              .expect(200)
              .end(function (releaseUpdateErr, releaseUpdateRes) {
                // Handle release update error
                if (releaseUpdateErr) {
                  return done(releaseUpdateErr);
                }

                // Set assertions
                (releaseUpdateRes.body._id).should.equal(releaseSaveRes.body._id);
                (releaseUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an release if no title is provided', function (done) {
    // Invalidate title field
    release.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(422)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Set message assertion
            (releaseSaveRes.body.message).should.match('Title cannot be blank');

            // Handle release save error
            done(releaseSaveErr);
          });
      });
  });

  it('should be able to delete an release if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Delete an existing release
            agent.delete('/api/releases/' + releaseSaveRes.body._id)
              .send(release)
              .expect(200)
              .end(function (releaseDeleteErr, releaseDeleteRes) {
                // Handle release error error
                if (releaseDeleteErr) {
                  return done(releaseDeleteErr);
                }

                // Set assertions
                (releaseDeleteRes.body._id).should.equal(releaseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single release if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new release model instance
    release.user = user;
    var releaseObj = new Release(release);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (releaseInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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

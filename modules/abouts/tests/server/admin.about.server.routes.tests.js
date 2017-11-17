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
describe('About Admin CRUD tests', function () {
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

  it('should be able to save an about if logged in', function (done) {
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

        // Save a new about
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle about save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
            }

            // Get a list of abouts
            agent.get('/api/abouts')
              .end(function (aboutsGetErr, aboutsGetRes) {
                // Handle about save error
                if (aboutsGetErr) {
                  return done(aboutsGetErr);
                }

                // Get abouts list
                var abouts = aboutsGetRes.body;

                // Set assertions
                (abouts[0].user._id).should.equal(userId);
                (abouts[0].title).should.match('About Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an about if signed in', function (done) {
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

        // Save a new about
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle about save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
            }

            // Update about title
            about.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing about
            agent.put('/api/abouts/' + aboutSaveRes.body._id)
              .send(about)
              .expect(200)
              .end(function (aboutUpdateErr, aboutUpdateRes) {
                // Handle about update error
                if (aboutUpdateErr) {
                  return done(aboutUpdateErr);
                }

                // Set assertions
                (aboutUpdateRes.body._id).should.equal(aboutSaveRes.body._id);
                (aboutUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an about if no title is provided', function (done) {
    // Invalidate title field
    about.title = '';

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

        // Save a new about
        agent.post('/api/abouts')
          .send(about)
          .expect(422)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Set message assertion
            (aboutSaveRes.body.message).should.match('Title cannot be blank');

            // Handle about save error
            done(aboutSaveErr);
          });
      });
  });

  it('should be able to delete an about if signed in', function (done) {
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

        // Save a new about
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle about save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
            }

            // Delete an existing about
            agent.delete('/api/abouts/' + aboutSaveRes.body._id)
              .send(about)
              .expect(200)
              .end(function (aboutDeleteErr, aboutDeleteRes) {
                // Handle about error error
                if (aboutDeleteErr) {
                  return done(aboutDeleteErr);
                }

                // Set assertions
                (aboutDeleteRes.body._id).should.equal(aboutSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single about if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new about model instance
    about.user = user;
    var aboutObj = new About(about);

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

        // Save a new about
        agent.post('/api/abouts')
          .send(about)
          .expect(200)
          .end(function (aboutSaveErr, aboutSaveRes) {
            // Handle about save error
            if (aboutSaveErr) {
              return done(aboutSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (aboutInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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

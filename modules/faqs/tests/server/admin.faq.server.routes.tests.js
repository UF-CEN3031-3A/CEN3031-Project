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
describe('Faq Admin CRUD tests', function () {
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

  it('should be able to save an faq if logged in', function (done) {
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

        // Save a new faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
            }

            // Get a list of faqs
            agent.get('/api/faqs')
              .end(function (faqsGetErr, faqsGetRes) {
                // Handle faq save error
                if (faqsGetErr) {
                  return done(faqsGetErr);
                }

                // Get faqs list
                var faqs = faqsGetRes.body;

                // Set assertions
                (faqs[0].user._id).should.equal(userId);
                (faqs[0].title).should.match('Faq Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an faq if signed in', function (done) {
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

        // Save a new faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
            }

            // Update faq title
            faq.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing faq
            agent.put('/api/faqs/' + faqSaveRes.body._id)
              .send(faq)
              .expect(200)
              .end(function (faqUpdateErr, faqUpdateRes) {
                // Handle faq update error
                if (faqUpdateErr) {
                  return done(faqUpdateErr);
                }

                // Set assertions
                (faqUpdateRes.body._id).should.equal(faqSaveRes.body._id);
                (faqUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an faq if no title is provided', function (done) {
    // Invalidate title field
    faq.title = '';

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

        // Save a new faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(422)
          .end(function (faqSaveErr, faqSaveRes) {
            // Set message assertion
            (faqSaveRes.body.message).should.match('Title cannot be blank');

            // Handle faq save error
            done(faqSaveErr);
          });
      });
  });

  it('should be able to delete an faq if signed in', function (done) {
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

        // Save a new faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
            }

            // Delete an existing faq
            agent.delete('/api/faqs/' + faqSaveRes.body._id)
              .send(faq)
              .expect(200)
              .end(function (faqDeleteErr, faqDeleteRes) {
                // Handle faq error error
                if (faqDeleteErr) {
                  return done(faqDeleteErr);
                }

                // Set assertions
                (faqDeleteRes.body._id).should.equal(faqSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single faq if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new faq model instance
    faq.user = user;
    var faqObj = new Faq(faq);

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

        // Save a new faq
        agent.post('/api/faqs')
          .send(faq)
          .expect(200)
          .end(function (faqSaveErr, faqSaveRes) {
            // Handle faq save error
            if (faqSaveErr) {
              return done(faqSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (faqInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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

'use strict';

var semver = require('semver'),
  should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  credentialsEmail,
  user,
  _user,
  admin;

/**
 * User routes tests
 */
describe('User CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials with username
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user credentials with email
    credentialsEmail = {
      usernameOrEmail: 'test@test.com',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    _user = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    };

    user = new User(_user);

    // Save a user to the test db and create new article
    user.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should be able to login with username successfully and logout successfully', function (done) {
    // Login with username
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Logout
        agent.get('/api/auth/signout')
          .expect(302)
          .end(function (signoutErr, signoutRes) {
            if (signoutErr) {
              return done(signoutErr);
            }

            signoutRes.redirect.should.equal(true);

            // NodeJS v4 changed the status code representation so we must check
            // before asserting, to be comptabile with all node versions.
            if (semver.satisfies(process.versions.node, '>=4.0.0')) {
              signoutRes.text.should.equal('Found. Redirecting to /');
            } else {
              signoutRes.text.should.equal('Moved Temporarily. Redirecting to /');
            }

            return done();
          });
      });
  });

  it('should be able to login with email successfully and logout successfully', function (done) {
    // Login with username
    agent.post('/api/auth/signin')
      .send(credentialsEmail)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Logout
        agent.get('/api/auth/signout')
          .expect(302)
          .end(function (signoutErr, signoutRes) {
            if (signoutErr) {
              return done(signoutErr);
            }

            signoutRes.redirect.should.equal(true);

            // NodeJS v4 changed the status code representation so we must check
            // before asserting, to be comptabile with all node versions.
            if (semver.satisfies(process.versions.node, '>=4.0.0')) {
              signoutRes.text.should.equal('Found. Redirecting to /');
            } else {
              signoutRes.text.should.equal('Moved Temporarily. Redirecting to /');
            }

            return done();
          });
      });
  });

  it('should be able to get a single user details if admin', function (done) {
    user.roles = ['user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get single user information from the database
          agent.get('/api/users/' + user._id)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should be able to update a single user details if admin', function (done) {
    user.roles = ['user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get single user information from the database

          var userUpdate = {
            firstName: 'admin_update_first',
            lastName: 'admin_update_last',
            roles: ['admin']
          };

          agent.put('/api/users/' + user._id)
            .send(userUpdate)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body.firstName.should.be.equal('admin_update_first');
              userInfoRes.body.lastName.should.be.equal('admin_update_last');
              userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('should be able to delete a single user if admin', function (done) {
    user.roles = ['user', 'admin'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          agent.delete('/api/users/' + user._id)
            .expect(200)
            .end(function (userInfoErr, userInfoRes) {
              if (userInfoErr) {
                return done(userInfoErr);
              }

              userInfoRes.body.should.be.instanceof(Object);
              userInfoRes.body._id.should.be.equal(String(user._id));

              // Call the assertion callback
              return done();
            });
        });
    });
  });

  it('forgot password should return 400 for non-existent username', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: 'some_username_that_doesnt_exist'
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('No account with that username or email has been found');
          return done();
        });
    });
  });

  it('forgot password should return 400 for empty username/email', function (done) {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: ''
        })
        .expect(422)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Username/email field must not be blank');
          return done();
        });
    });
  });

  it('forgot password should return 400 for no username or email provided', function (done) {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({})
        .expect(422)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('Username/email field must not be blank');
          return done();
        });
    });
  });

  it('forgot password should return 400 for non-local provider set for the user object', function (done) {
    var provider = 'facebook';
    user.provider = provider;
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          res.body.message.should.equal('It seems like you signed up using your ' + user.provider + ' account, please sign in using that provider.');
          return done();
        });
    });
  });

  it('forgot password should be able to reset password for user password reset request using username', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, function (err, userRes) {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);
            res.body.message.should.be.equal('Failure sending email');
            return done();
          });
        });
    });
  });

  it('forgot password should be able to reset password for user password reset request using email', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.email
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, function (err, userRes) {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);
            res.body.message.should.be.equal('Failure sending email');
            return done();
          });
        });
    });
  });

  it('forgot password should be able to reset the password using reset token', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          User.findOne({ username: user.username.toLowerCase() }, function (err, userRes) {
            userRes.resetPasswordToken.should.not.be.empty();
            should.exist(userRes.resetPasswordExpires);

            agent.get('/api/auth/reset/' + userRes.resetPasswordToken)
            .expect(302)
            .end(function (err, res) {
              // Handle error
              if (err) {
                return done(err);
              }

              res.headers.location.should.be.equal('/password/reset/' + userRes.resetPasswordToken);

              return done();
            });
          });
        });
    });
  });

  it('forgot password should return error when using invalid reset token', function (done) {
    user.roles = ['user'];

    user.save(function (err) {
      should.not.exist(err);
      agent.post('/api/auth/forgot')
        .send({
          usernameOrEmail: user.username
        })
        .expect(400)
        .end(function (err, res) {
          // Handle error
          if (err) {
            return done(err);
          }

          var invalidToken = 'someTOKEN1234567890';
          agent.get('/api/auth/reset/' + invalidToken)
          .expect(302)
          .end(function (err, res) {
            // Handle error
            if (err) {
              return done(err);
            }

            res.headers.location.should.be.equal('/password/reset/invalid');

            return done();
          });
        });
    });
  });

  it('should be able to change user own password successfully', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: credentials.password
          })
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Password changed successfully');
            return done();
          });
      });
  });

  it('should not be able to change user own password if wrong verifyPassword is given', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890-ABC-123-Aa$',
            currentPassword: credentials.password
          })
          .expect(422)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Passwords do not match');
            return done();
          });
      });
  });

  it('should not be able to change user own password if wrong currentPassword is given', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '1234567890Aa$',
            verifyPassword: '1234567890Aa$',
            currentPassword: 'some_wrong_passwordAa$'
          })
          .expect(422)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Current password is incorrect');
            return done();
          });
      });
  });

  it('should not be able to change user own password if no new password is at all given', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Change password
        agent.post('/api/users/password')
          .send({
            newPassword: '',
            verifyPassword: '',
            currentPassword: credentials.password
          })
          .expect(422)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.message.should.equal('Please provide a new password');
            return done();
          });
      });
  });

  it('should not be able to change user own password if not signed in', function (done) {

    // Change password
    agent.post('/api/users/password')
      .send({
        newPassword: '1234567890Aa$',
        verifyPassword: '1234567890Aa$',
        currentPassword: credentials.password
      })
      .expect(401)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        res.body.message.should.equal('User is not signed in');
        return done();
      });
  });

  it('should be able to get own user details successfully', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get own user details
        agent.get('/api/users/me')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }

            res.body.should.be.instanceof(Object);
            res.body.username.should.equal(user.username);
            res.body.email.should.equal(user.email);
            should.not.exist(res.body.salt);
            should.not.exist(res.body.password);
            return done();
          });
      });
  });

  it('should not be able to get any user details if not logged in', function (done) {
    // Get own user details
    agent.get('/api/users/me')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        should.not.exist(res.body);
        return done();
      });
  });

  afterEach(function (done) {
    User.remove().exec(done);
  });
});

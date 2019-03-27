const router = require('express').Router();
const { User } = require('../database/models');
module.exports = router;

// Logs a user in
router.post('/login', (req, res, next) => {
  User.findOne({
    where: { email: req.body.email }
  })
    .then(user => {
      if (!user) {
        res.status(401).send('Wrong email and/or password');
      } else if (!user.correctPassword(req.body.password)) {
        res.status(401).send('Wrong email and/or password');
      } else {
        req.login(user, err => (err ? next(err) : res.json(user)));
      }
    })
    .catch(next);
});

// Registers a new user in the database
router.post('/signup', (req, res, next) => {
  req.body.balance = 500000;
  User.create(req.body)
    .then(user => {
      req.login(user, err => (err ? next(err) : res.json(user)));
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('Email address already in use.');
      } else if (err.name === 'SequelizeValidationError') {
        if (err.errors[0].message.slice(0, 19) === 'Validation notEmpty') {
          res.status(411).send(`${err.errors[0].path} field left empty`);
        }
        if (err.errors[0].message.slice(0, 18) === 'Validation isEmail') {
          res.status(411).send(`Please enter valid email address`);
        }
      } else {
        next(err);
      }
    });
});

// Logs a user out
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// Returns the logged in user
router.get('/isLoggedIn', (req, res) => {
  res.json(req.user);
});

// EXPRESS CONTROLLER for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (model + node package).
\* -------------------------------------------------------------------------- */

const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.getUserInfo = (req, res, next) =>
{
  res.send('user info');
};

/* -------------------------------------------------------------------------- *\
    2) Defines the signup, signin & logout functions.
\* -------------------------------------------------------------------------- */

/* ------------------------ SIGNUP ------------------------ */

exports.signup = (req, res) =>
{
  //Applies bcrypt's hash on the password in 10 steps (= lvl of security),
  //then creates a new instance of UserModel and saves it in the DB.
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
    {
      const newUser = new UserModel(
      {
        email: req.body.email,
        username: req.body.username,
        avatar: req.body.avatar,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hash
      });
      newUser.save()
        .then(() => res.status(201).json({ message: 'User cree' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

/* ------------------------ SIGNIN ------------------------ */

exports.signin = (req, res) =>
{
  //Finds the user matching the given username and, if there is one,
  //compares the password entered with the user's hashed password.
  //If the comparison returns TRUE, defines a user token.
  UserModel.findOne({ email: req.body.username })
    .then(user =>
    {
      if (!user)
      {
        return res.status(401).json({ error: 'User not found' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid =>
        {
          if (!valid)
          {
            return res.status(401).json({ error: 'Bad password' });
          }
          res.status(200).json(
          {
            //.sign de jsonwebtoken permet de créer un token sur base de l'id user en payload
            //(= données encodées dans le token au moyen de la chaîne secrète)
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' })
          });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
};

/* ------------------------ LOGOUT ------------------------ */

exports.logout = (req, res) =>
{
  req.logout();
  req.session.destroy();
  res.redirect('http://localhost:4200/');
};

/* -------------------------------------------------------------------------- *\
    3) 
\* -------------------------------------------------------------------------- */

exports.getCurrentUser = (req, res) =>
{
  console.log(req);
  res.send('ok');
};
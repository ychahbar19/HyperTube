// EXPRESS CONTROLLER for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (model + node package).
\* -------------------------------------------------------------------------- */

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* -------------------------------------------------------------------------- *\
    2) Defines the signup & login functions.
\* -------------------------------------------------------------------------- */

exports.signup = (req, res, next) =>
{
  //Applies bcrypt's hash on the password in 10 steps (= lvl of security),
  //then creates a new instance of User and saves it in the DB.
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
    {
      const user = new User(
      {
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'User cree' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) =>
{
  //Finds the user matching the given email and, if there is one,
  //compares the password entered with the user's hashed password.
  //If the comparison returns TRUE, defines a user token.
  User.findOne({ email: req.body.email })
    .then(user =>
    {
      if (!user)
        return res.status(401).json({ error: 'User not found' });
      bcrypt.compare(req.body.password, user.password)
        .then(valid =>
        {
          if (!valid)
            return res.status(401).json({ error: 'Bad password' });
          res.status(200).json(
          {
            //.sign de jsonwebtoken permet de créer un token,
            //sur base de l'id user en payload (= données encodées dans le token
            //au moyen de la chaîne secrète)
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

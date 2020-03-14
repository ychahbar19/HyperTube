/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls to the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- Signup, signin, logout ----- */
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.get('/logout', UserController.logout);

/*
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});
*/


router.get('/', 
//UserController.getCurrentUser
(req, res) =>
{
    const sessionContents = req.session;
    console.log(sessionContents);
    res.send('ok')
}
);

/* ----- Fallback function ----- */
router.use((req, res) =>
{
  res.send('Bad request to /api/user');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

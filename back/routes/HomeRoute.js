// EXPRESS ROUTER for Home

/* ------------------------------------------------------------------------ *\
    1) Imports the required elements and creates express' Router object.
\* ------------------------------------------------------------------------ */

const express = require('express');
const router = express.Router();

/* ------------------------------------------------------------------------ *\
    2) Calls the controller's functions based on the request type/route.
\* ------------------------------------------------------------------------ */

/* ----- check ----- */
/*
router.use('/', (req, res) =>
{
  const layout_elements =
  {
    'en': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' },
    'fr': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' }
  };
  res.status(200).json(
  {
    message: 'Successful request to /',
    layout_elements: layout_elements['en']
  });
});
*/

/* ----- Fallback function ----- */
router.use((req, res) => {
   res.send('Bad request to /');
});

/* ------------------------------------------------------------------------ *\
    3) Exports the router.
\* ------------------------------------------------------------------------ */

module.exports = router;

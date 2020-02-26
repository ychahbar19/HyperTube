const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  /*
  const layout_elements =
  [
    { meta_title: 'Home', h1_title: 'Welcome to HyperTube' }
  ];*/
  const layout_elements =
  {
    'en': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' },
    'fr': { field_1: 'field_1', field_2: 'field_2', field_3: 'field_3' }
  };
  res.status(200).json(
  {
    message: 'Successful request to /',
    layout_elements: layout_elements.en
  });
});

module.exports = router;
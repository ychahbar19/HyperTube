// EXPRESS CONTROLLER for Thing

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (model).
\* -------------------------------------------------------------------------- */

const Thing = require('../models/Thing');

/* -------------------------------------------------------------------------- *\
    2) Defines the database CRUD functions (Create, Read, Update, Delete).
\* -------------------------------------------------------------------------- */

// ----------- CREATE -----------

exports.createThing = (req, res, next) =>
{
  //
  const thingObject = JSON.parse(req.body.thing);

  //Deletes the id from the request's body (since mongodb will generate another).
  delete thingObject._id;

  //Creates a new object Thing.
  const thing = new Thing(
  {
    //Copies all the fields from the object and uses them to fill the model.
    ...thingObject, //Alternative: { title: thingObject.title, description: etc. }
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  //Uses mongoose's .save method to save the 'thing' in the database
  //(this uses the .then .catch structure because it's asynchronous).
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistre' }))
    .catch(error => res.status(400).json({ error: error }));//or simply 'error'
};

// ----------- READ -----------

exports.getOneThing = (req, res, next) =>
{
  //Finds the object that matches the id given as route parameter (:id).
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) =>
{
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};

// ----------- UPDATE -----------

exports.modifyThing = (req, res, next) =>
{
  //Updates the object that matches the id given as route parameter (:id),
  //with the new version of this object, but keeping it's current id.
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// ----------- DELETE -----------

exports.deleteThing = (req, res, next) =>
{
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
};

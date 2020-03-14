/* ------------------------------------------------------------------------ *\
    Connects to MongoDB (https://cloud.mongodb.com/).
\* ------------------------------------------------------------------------ */

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://cbrichau:hypertube19@cluster0-fzc0r.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
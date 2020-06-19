/* ------------------------------------------------------------------------ *\
    Connects to MongoDB (https://cloud.mongodb.com/).
\* ------------------------------------------------------------------------ */

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://cbrichau:hypertube19@cluster0-fzc0r.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
const conn = mongoose.connection;
if (conn) {
  console.log('Connexion à MongoDB réussie !');
} else {
  console.log('Connexion à MongoDB échouée !');
}
  // .then(() => console.log('Connexion à MongoDB réussie !'))
  // .catch(() => console.log('Connexion à MongoDB échouée !'));
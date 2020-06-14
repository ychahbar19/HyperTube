const fs = require('fs');

const MovieHistoryModel = require('./models/MovieHistoryModel');

const colors = require('colors');
const CronJob = require('cron').CronJob;

const deleteMovies = movies => {
  for (const movie of movies) {
    const movieName = movie.hash + '.' + movie.extension;
    fs.unlink('./assets/videos/downloaded/' + movieName, err => {
      if (err)
        console.log((movieName + ' had already been deleted from server!').red);
      else {
        console.log((movieName + ' has been deleted from server').green);
        MovieHistoryModel.deleteOne({ hash: movie.hash }, (err, obj) => {
          if (err)
            console.log(('Failed to delete ' + movieName + ' from database !').red);
          else
            console.log((movieName + ' has been deleted from database').green);
        });
      }
    });
  }
};

exports.startJob = async () => {
  const job = new CronJob(
    '0 0 * * *',
    async () => {
      const now = Date.now();
      const oneMonthAgo = now - 2628000000;
      const moviesToDelete = await MovieHistoryModel.find({
        lastSeen: { $lte: oneMonthAgo }
      });
      if (Array.isArray(moviesToDelete) && moviesToDelete.length > 0) {
        deleteMovies(moviesToDelete);
      } else {
        console.log("No movies to be deleted !".yellow);
      }
    },
    null,
    true,
    'Europe/Brussels'
  );
  console.log('Is job running ? ', job.running);
}
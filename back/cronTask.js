const MovieHistoryModel = require('./models/MovieHistoryModel');

const CronJob = require('cron').CronJob;

const job = new CronJob(
  '0 0 * * *',
  () => {
    // check MovieHistoryModel -> query : 'get all hash where lastSeen <= date.now() - 1 month'
    // delete all movies in assets/videos/downloaded/ where the name (- ext) match hash
  },
  null,
  true,
  'Europe/Brussels'
);
console.log('Is job running ? ', job.running);
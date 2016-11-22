'use strict';

var schedule = require('node-schedule'),
    fs = require('fs-extra'),
    glob = require('glob');

var responses = 'public/responses/**/*.*';

var rule = new schedule.RecurrenceRule();
rule.hour = 2;

module.exports = function () {
  // Every two hours, delete all files that are older than that
  schedule.scheduleJob(rule, function () {
    var now = Date.now();

    glob(responses, function(err, files) {
      files.forEach(function (file) {
        var stats = fs.statSync(file),
            birth = new Date(stats.birthtime).getTime(),
            death = birth + 7200000;

        if (death <= now) {
          fs.remove(file);
        }
      });
    });
  });
}


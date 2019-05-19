'use strict';

const debug = require('debug')('wc:logs');

// logs format:  logs = [{ angleDiff: 0, end: 0, start: 0 }];

/**
 * Returns a new log based on current cylinder status. Log format is: { angleDiff: 0, end: 0, start: 0 }.
 * Logs were used for a speed based PID.
 * @param {object} status
 * @returns {object} log: contains angleDiff, start and end times (in hrtime format)
 */
function generateLog(status) {
  let log = {
    angleDiff: status.absoluteAngle.current - status.absoluteAngle.previous,
    end: status.epoch.current,
    start: status.epoch.previous
  };
  debug(JSON.stringify(log, undefined, 2));
  return log;
}

/**
 * Function managing an array of logs. New log is added and too old ones discarded.
 * @param {object} status properties used are logs and timeSpan (in ms): time range back from now over which the logs are kept
 * @param {object} newLog log to add to logs
 */
function manageLogs(status, newLog) {
  status.logs.push(newLog);
  debug(JSON.stringify(status.logs, undefined, 2));

  status.logs = status.logs.filter(
    entry => entry.start > Date.now() - status.timeSpan
  );
  debug(JSON.stringify(status.logs, undefined, 2));
}

module.exports = { manageLogs, generateLog };

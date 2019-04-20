'use strict';

const debug = require('debug')('wc:logs');

// logs format:  logs = [{ angleDiff: 0, end: 0, start: 0 }];

/**
 * Returns a new log based on current cylinder status. Log format is: { angleDiff: 0, end: 0, start: 0 }
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
 * @param {array} logs array of log entries
 * @param {object} newLog log to add to logs
 * @param {number} timeSpan time range back from now over which the logs are kept
 */
function manageLogs(logs, newLog, timeSpan) {
  logs.push(newLog);
  logs = logs.filter((entry) => entry.start > Date.now - timeSpan);
  debug(JSON.stringify(logs, undefined, 2));
}

module.exports = { manageLogs, generateLog };

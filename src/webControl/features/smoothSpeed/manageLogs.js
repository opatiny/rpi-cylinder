'use strict';

// logs format:  logs = [{ angleDiff: 0, end: 0, start: 0 }];

/**
 * Returns a new log based on current cylinder status. Log format is: { angleDiff: 0, end: 0, start: 0 }
 * @param {object} status
 * @returns {object} log: contains angleDiff, start and end times (in hrtime format)
 */
function generateLog(status) {
  return {
    angleDiff: status.absoluteAngle.current - status.absoluteAngle.previous,
    end: status.time.current,
    start: status.time.previous
  };
}


function manageLogs(logs, newLog, timeSpan) {
  logs.push(newLog);
  logs = logs.filter((entry)=> entry.start > )
}

module.exports = manageLogs;

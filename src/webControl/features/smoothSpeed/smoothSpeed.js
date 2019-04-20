'use strict';

const debug = require('debug')('wc:speed-pid'); // wc for web control

const generateLog = require('./logs').generateLog;
const manageLogs = require('./logs').manageLogs;

/**
 * Returns a speed (in deg/s) smoothed on a defined time span (in ms).
 * @param {object} status parameters used are logs and timeSpan (ms)
 * @returns {number} smoothSpeed : speed smoothed on a defined time span in [degrees/s],
 */
function smoothSpeed(status) {
  let log = generateLog(status);
  manageLogs(status.logs, log, status.timeSpan);

  let angleDiffSum = status.logs.reduce((sum, value) => sum + value.angleDiff, 0);
  let timeDiff = status.log[0].end - status.logs[status.logs.length() - 1].start;

  let smoothSpeed = angleDiffSum / timeDiff;
  debug(`smoothSpeed\t${smoothSpeed}`);

  return smoothSpeed;
}

module.exports = smoothSpeed;

'use strict';

const generateLog = require('../logs').generateLog;
const manageLogs = require('../logs').manageLogs;

let status = {
  angleCenter: 0,
  previousAngleCenter: 0,
  radiusCenter: 0,
  absoluteAngle: {
    current: 0,
    previous: 0
  },
  epoch: {
    current: 0,
    previous: 0
  },
  logs: [],
  timeSpan: 100
};

let log = generateLog(status);
manageLogs(status.logs, log, status.timeSpan); // this won't work because the epoch is not right compared to current epoch


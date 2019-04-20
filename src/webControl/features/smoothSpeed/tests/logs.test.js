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
  timeSpan: 0
};

let log = generateLog(status);
manageLogs(status.logs, log, 500);


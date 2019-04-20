'use strict';

// main project code, run using pm2 at boot
const exec = require('child_process').exec; // for shutdown

const debug = require('debug')('wc:index'); // wc for web control
const Five = require('johnny-five');

const Board = require('../preferences.js').Board;

debug('Packages required');

const cylinderPrototype = require('../preferences.js').cylinderPrototype;

debug('cylinder parameters required');

let rpi = new Board();

var board = new Five.Board({
  io: rpi
});
debug('board created');

const toPrototypeInclination = require('./features/gyroToProto3Angle');
const toAlpha = require('./features/toAlphaFunction');
const control = require('./features/control');
const stable = require('./features/stable');
const anglePID = require('./features/pid/angle-pid');
const speedPID = require('./features/pid/speed-pid');
const updateAbsoluteAngle = require('./features/absoluteAngle');
const generateLog = require('./features/smoothSpeed/logs').generateLog;
const manageLogs = require('./features/smoothSpeed/logs').manageLogs;

debug('functions required');

board.on('ready', async function () {
  var accelerometer = new Five.Accelerometer({
    controller: 'MPU6050',
    sensitivity: 16 // optional
  });
  debug('Accelerometer defined');

  // defining a general object passed to all the subfunctions
  let status = {
    angleCenter: 0,
    previousAngleCenter: 0,
    radiusCenter: 0,
    remotePrefs: require('./ws'),
    absoluteAngle: {
      current: 0,
      previous: 0
    },
    inclination: {
      current: 0,
      previous: 0
    },
    hrtime: {
      current: [0, 0],
      previous: [0, 0]
    },
    epoch: {
      current: 0,
      previous: 0
    },
    pid: {
      currentAngle: 0,
      targetAngle: undefined,
      previousRadius: 0,
      previousEpoch: 0,
      currentSpeed: 0,
      previousSpeed: 0
    },
    smooth: true,
    logs: [],
    timeSpan: 100 // arbitrary value in ms
  };

  // status.remotePrefs.algorithm = 'control'; // testing pid
  // status.remotePrefs.radius = 20;

  status.remotePrefs.algorithm = 'angle-pid'; // testing pid

  accelerometer.on('change', async function () {
    // updating current variables
    status.inclination.current = this.inclination;
    status.hrtime.current = process.hrtime();
    status.epoch.current = Date.now();

    updateAbsoluteAngle(status);

    // updating logs -> for smoothed speed
    let log = generateLog(status);
    manageLogs(status, log);

    if (status.remotePrefs.ws) {
      status.remotePrefs.ws.send(status.inclination.current);
    }

    const baseAngle = toPrototypeInclination(status.inclination.current);

    if (status.remotePrefs.algorithm === 'shutdown') {
      exec('shutdown -h now'); // shutting down
    } else if (status.remotePrefs.algorithm === 'control') {
      status.angleCenter = await control(baseAngle, status.remotePrefs);
      status.radiusCenter = Math.abs(status.remotePrefs.radius);
    } else if (status.remotePrefs.algorithm === 'center') {
      status.angleCenter = 0;
      status.radiusCenter = 0;
    } else if (status.remotePrefs.algorithm === 'basic-stabilization') {
      status.angleCenter = await stable(status);
      status.radiusCenter = cylinderPrototype.maxRadiusCenter;
      debug(`radiusCenter: ${status.radiusCenter}`);
    } else if (status.remotePrefs.algorithm === 'speed-pid') {
      debug(status);

      if ((Date.now() - status.pid.previousEpoch) > 100) {
        status.pid.previousEpoch = Date.now();
        status.radiusCenter = speedPID(status);

        // placing the mass on a line horizontal to the ground
        if (status.radiusCenter < 0) {
          status.angleCenter = baseAngle - 90;
        } else {
          status.angleCenter = baseAngle + 90;
        }

        debug('radiusCenter: ', status.radiusCenter, 'angleCenter: ', status.angleCenter);

        // taking absolute value of radius, which is needed by toAlpha()
        status.radiusCenter = Math.abs(status.radiusCenter);
      }
    } else if (status.remotePrefs.algorithm === 'stabilization') { // aka angle-pid
      status.pid.currentAngle = status.absoluteAngle.current;
      if (status.pid.targetAngle === undefined) {
        status.pid.targetAngle = status.absoluteAngle.current;
      }
      debug('targetAngle: ', status.pid.targetAngle, 'currentAngle: ', status.pid.currentAngle);
      status.radiusCenter = anglePID(status);

      // placing the mass on a line horizontal to the ground
      if (status.radiusCenter < 0) {
        status.angleCenter = baseAngle - 90;
      } else {
        status.angleCenter = baseAngle + 90;
      }

      debug('radiusCenter:', status.radiusCenter, 'angleCenter:', status.angleCenter);

      // taking absolute value of radius, which is needed by toAlpha()
      status.radiusCenter = Math.abs(status.radiusCenter);
    }

    await toAlpha(status.radiusCenter, status.angleCenter); // writing servos angles

    // updating previous variables
    status.absoluteAngle.previous = status.absoluteAngle.current;
    status.inclination.previous = status.inclination.current;
    status.hrtime.previous = status.hrtime.current;
    status.epoch.previous = status.epoch.current;
    status.pid.previousRadius = status.radiusCenter;
    status.previousAngleCenter = status.angleCenter;
  });
});

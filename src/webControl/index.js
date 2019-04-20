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
const speedPID = require('./features/pid/speed-pid');
const updateAbsoluteAngle = require('./features/absoluteAngle');

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
      currentSpeed: 0,
      targetSpeed: 0,
      previousRadius: 0,
    },
  };

  status.remotePrefs.algorithm = 'pid'; // testing pid

  accelerometer.on('change', async function () {
    // let newCounter = counter++;
    // debug('Number of changes detected: ' + newCounter);
    status.inclination.current = this.inclination;
    status.time.current = process.hrtime();
    status.epoch.current = Date.now();

    updateAbsoluteAngle(status);

    if (status.remotePrefs.ws) {
      status.remotePrefs.ws.send(status.inclination.current);
    }

    const baseAngle = toPrototypeInclination(status.inclination.current);

    if (status.remotePrefs.algorithm === 'shutdown') {
      exec('shutdown -h now'); // shutting down
    } else if (status.remotePrefs.algorithm === 'control') {
      status.angleCenter = await control(baseAngle, status.remotePrefs); // try with status.acc.current.inclination instead of baseAngle
      status.radiusCenter = Math.abs(status.remotePrefs.radius);
    } else if (status.remotePrefs.algorithm === 'center') {
      status.angleCenter = 0;
      status.radiusCenter = 0;
    } else if (status.remotePrefs.algorithm === 'stabilization') {
      status.angleCenter = await stable(status);
      status.radiusCenter = cylinderPrototype.maxRadiusCenter;
      debug(`radiusCenter: ${status.radiusCenter}`);
    } else if (status.remotePrefs.algorithm === 'pid') {
      debug(status);

      status.radiusCenter = speedPID(status);

      // placing the mass on a line horizontal to the ground
      if (status.radiusCenter < 0) {
        status.angleCenter = baseAngle + 90;
      } else {
        status.angleCenter = baseAngle - 90;
      }

      console.log('radiusCenter: ', status.radiusCenter, 'angleCenter: ', status.angleCenter);

      // taking absolute value of radius, which is needed by toAlpha()
      status.radiusCenter = Math.abs(status.radiusCenter);
    }

    await toAlpha(status.radiusCenter, status.angleCenter);

    status.absoluteAngle.previous = status.absoluteAngle.current;
    status.inclination.previous = status.inclination.current;
    status.time.previous = status.time.current;
    status.epoch.previous = status.epoch.current;
    status.pid.previousRadius = status.radiusCenter;
    status.previousAngleCenter = status.angleCenter;
  });
});

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

debug('toAlpha, toPrototypeInclination, control functions required');

board.on('ready', async function () {
  var accelerometer = new Five.Accelerometer({
    controller: 'MPU6050',
    sensitivity: 1024 // optional
  });
  debug('Accelerometer defined');

  // defining a general object passed to all the subfunctions
  let status = {
    angleCenter: 0,
    radiusCenter: 0,
    remotePrefs: require('./ws'),
    acc: {
      current: {},
      previous: {}
    },
    inclinationLog: [0, 0],
    angleCenterLog: [0],
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
    status.acc.current = this;
    status.acc.current.time = process.hrtime();

    if (status.remotePrefs.ws) {
      status.remotePrefs.ws.send(status.acc.current.inclination);
    }
    debug(`inclination\t${status.acc.current.inclination}`);

    const baseAngle = toPrototypeInclination(status.acc.current.inclination);

    if (status.remotePrefs.algorithm === 'shutdown') {
      exec('shutdown -h now'); // shutting down
    } else if (status.remotePrefs.algorithm === 'control') {
      status.angleCenter = await control(baseAngle, status.remotePrefs); // try with status.acc.current.inclination instead of baseAngle
      status.radiusCenter = Math.abs(status.remotePrefs.radius);
    } else if (status.remotePrefs.algorithm === 'center') {
      status.angleCenter = 0;
      status.radiusCenter = 0;
    } else if (status.remotePrefs.algorithm === 'stabilization') {
      status.inclinationLog = [status.inclinationLog[status.inclinationLog.length - 1]]; // this allows to have the two last values of inclination
      debug(`inclination log\t${status.inclinationLog}`);

      status.inclinationLog.push(status.acc.inclination);
      debug(`inclination log\t${status.inclinationLog}`);

      status.angleCenter = await stable(status.inclinationLog, status.angleCenterLog);
      status.angleCenterLog.push(status.angleCenter);

      status.radiusCenter = cylinderPrototype.maxRadiusCenter;
      debug(`radiusCenter: ${status.radiusCenter}`);
    } else if (status.remotePrefs.algorithm === 'pid') {
      debug(`pid object\t${status.pid}`);

      status.radiusCenter = speedPID(status);

      // placing the mass on a line horizontal to the ground
      if (status.radiusCenter < 0) {
        status.angleCenter = baseAngle - 90;
      } else {
        status.angleCenter = baseAngle + 90;
      }
      console.log('radiusCenter: ', status.radiusCenter, 'angleCenter: ', status.angleCenter);
    }

    await toAlpha(status.radiusCenter, status.angleCenter); // is this line useful?

    status.acc.previous = status.acc.current;
    status.pid.previousRadius = status.radiusCenter;
  });
});

'use strict';

// main project code
const exec = require('child_process').exec; // for shutdown

const debug = require('debug')('wc:index'); // wc for web control
const Five = require('johnny-five');

const Board = require('../preferences.js').Board;

debug('Packages required');

const cylinderPrototype = require('../preferences.js').cylinderPrototype;

debug('cylinder parameters required');

const remotePrefs = require('./ws');

debug('prefs required');

let rpi = new Board();

var board = new Five.Board({
  io: rpi
});
debug('board created');

const toPrototypeInclination = require('./features/gyroToProto3Angle');
const toAlpha = require('./features/toAlphaFunction');
const control = require('./features/control');
const stable = require('./features/stable');
const stablePid = require('./features/pid/speed-pid');

debug('toAlpha, toPrototypeInclination, control functions required');

board.on('ready', async function () {
  var accelerometer = new Five.Accelerometer({
    controller: 'MPU6050',
    sensitivity: 1024 // optional
  });
  debug('Accelerometer defined');

  // var counter = 0; // to count the number of changes
  var inclinationLog = [0, 0];
  var pid = {
    currentSpeed: 0,
    targetSpeed: 0,
    currentRadius: 0
  };

  var angleCenterLog = [0];

  let previousAcc;

  accelerometer.on('change', async function () {
    // let newCounter = counter++;
    // debug('Number of changes detected: ' + newCounter);
    let acc = this;
    acc.time = process.hrtime();

    if (remotePrefs.ws) {
      remotePrefs.ws.send(acc.inclination);
    }
    debug(`${'inclination' + '\t'}${acc.inclination}`);

    const baseAngle = toPrototypeInclination(acc.inclination);
    var angleCenter;
    var radiusCenter;

    if (remotePrefs.algorithm === 'shutdown') {
      exec('shutdown -h now'); // shutting down
    } else if (remotePrefs.algorithm === 'control') {
      angleCenter = await control(baseAngle, remotePrefs);
      radiusCenter = Math.abs(remotePrefs.radius);
    } else if (remotePrefs.algorithm === 'center') {
      angleCenter = 0;
      radiusCenter = 0;
    } else if (remotePrefs.algorithm === 'stabilization') {
      inclinationLog = [inclinationLog[inclinationLog.length - 1]]; // this allows to have the two last values of inclination
      debug(`${'inclination log' + '\t'}${inclinationLog}`);

      inclinationLog.push(acc.inclination);
      debug(`${'inclination log' + '\t'}${inclinationLog}`);

      angleCenter = await stable(inclinationLog, angleCenterLog);
      angleCenterLog.push(angleCenter);

      radiusCenter = cylinderPrototype.maxRadiusCenter;
      debug(`radiusCenter: ${radiusCenter}`);
    } else if (remotePrefs.algorithm === 'pid') {
      debug(`${'inclination log' + '\t'}${pid}`);

      radiusCenter = stablePid(pid);

      if (radiusCenter < 0) {
        angleCenter = baseAngle - 90;
      } else {
        angleCenter = baseAngle + 90;
      }

      console.log('radiusCenter: ', radiusCenter, 'angleCenter: ', angleCenter);
    }

    await toAlpha(radiusCenter, angleCenter);

    previousAcc = acc;
  });
});

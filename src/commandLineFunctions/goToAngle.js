// code allowing the mass to move to a certain angle, the radius of the circle of the mass being a parameter
const debug = require('debug')('cl:angle');
const delay = require('delay');
const {
    servo1,
    servo2,
    servo3
} = require('../servoPins.js');

const cylinderPrototype = require('../preferences').cylinderPrototype;

async function goToAngle(angleCenter, radiusCenter) {

    const maxRadiusCenter = cylinderPrototype.maxRadiusCenter; // radius of the cylinder in [mm]
    if (radiusCenter === 'max') {
        radiusCenter = maxRadiusCenter;
    }
    debug('radiusCenter:' + '\t' + radiusCenter);

    const radiusServo = cylinderPrototype.radiusServo; // rayon défini par l'axe du servo en [mm]
    const bigRadius = cylinderPrototype.bigRadius; // distance between center of cylinder and center of servo [mm]
    const distance = cylinderPrototype.distance; // distance between point on center circle of cylinder and end of servo axis [mm]


    const delayValue = cylinderPrototype.delayValue; // the time to wait between to values of the angles in [ms]

    // parameters that depend on the servo characteristics
    const infoServo1 = cylinderPrototype.infoServo1; // parameters of the angles of servo1
    const infoServo2 = cylinderPrototype.infoServo2; // parameters of the angles of servo2
    const infoServo3 = cylinderPrototype.infoServo3; // parameters of the angles of servo3
    const setServoAngle = cylinderPrototype.setServoAngle; // function transforming angles of the servos setServoAngle()

    const formula = require('../returnAngleFormula.js');
    debug('angleFormula and parameters required');


    let r = radiusCenter;

    let xMassPosition1 = r * Math.cos(angleCenter / 180 * Math.PI);
    let yMassPosition1 = r * Math.sin(angleCenter / 180 * Math.PI);

    let xMassPosition2 = r * Math.cos((angleCenter + 120) / 180 * Math.PI);
    let yMassPosition2 = r * Math.sin((angleCenter + 120) / 180 * Math.PI);

    let xMassPosition3 = r * Math.cos((angleCenter + 240) / 180 * Math.PI);
    let yMassPosition3 = r * Math.sin((angleCenter + 240) / 180 * Math.PI);
    // debug('step2');


    // console.log(xMassPosition1, yMassPosition1, xMassPosition2, yMassPosition2, xMassPosition3);

    let angle1 = setServoAngle(180 - formula(xMassPosition1, yMassPosition1, bigRadius, radiusServo, distance), infoServo1);
    let angle2 = setServoAngle(180 - formula(xMassPosition2, yMassPosition2, bigRadius, radiusServo, distance), infoServo2);
    let angle3 = setServoAngle(180 - formula(xMassPosition3, yMassPosition3, bigRadius, radiusServo, distance), infoServo3);
    // debug('step3');


    debug(angleCenter + '\t' + angle1 + '\t' + angle2 + '\t' + angle3);

    servo1.to(angle1);
    servo2.to(angle2);
    servo3.to(angle3);
    debug('servos went to angles');


    await delay(delayValue);

}

module.exports = goToAngle;
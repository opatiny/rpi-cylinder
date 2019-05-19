'use strict';

/**
 * Converting rotation to translation speed of a rolling object
 * @param {number} omega rotation speed in [degree/s]
 * @param {number} radius in [mm]
 * @returns {number} translation speed in [m/s]
 */

function omegaToV(omega, radius) {
  return (omega * radius) / 1000;
}

module.exports = omegaToV;

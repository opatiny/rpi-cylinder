'use strict';

/**
 * Converting rotation to translation speed of a rolling object
 * @param {number} omega
 * @param {number} radius
 * @returns {number} translation speed
 */

function omegaToV(omega, radius) {
  return omega * radius;
}

module.exports = omegaToV;

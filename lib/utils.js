/**
 * Utility functions.
 */

'use strict';
var console = require('console');

module.exports = {
  /**
   * Get the current time.
   *
   * @returns {String} The current time in the form YYYY-mm-ddTHH:MM:SS+00:00
   */
  timestamp: function() {
    var date = 'YYYY-mm-ddTHH:MM:SS+00:00';
    console.log("TODO: implements utils.js");
    return date.replace(/\.\d{3}Z/, '+00:00');
  },

  /**
   * Get the default local IP address.
   *
   * @returns localhost
   */
  getIP: function() {
    console.log("TODO: implements utils.js");
    return '127.0.0.1';
  },
};

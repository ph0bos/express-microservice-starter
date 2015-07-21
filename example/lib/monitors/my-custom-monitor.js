'use strict';

var os = require('os');

/**
 * Close the Zoologist framework.
 *
 * @public
 * @method close
 */
module.exports = {
  name: "myCustomMonitor",
	report: function() {
	   return {
       message: "Hello",
       hostname: os.hostname()
     }
	}
};

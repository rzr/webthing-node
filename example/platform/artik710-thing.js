// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0
/**
 *
 * Copyright 2018-present Samsung Electronics France SAS, and other contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/// TODO: disable logs here by editing to '!console.log'
var log = console.log || function(arg) {};

var webthing;
try {
  webthing = require('webthing');
} catch(err) {
  webthing = require('../webthing');
}
var Property = webthing.Property;
var SingleThing = webthing.server.SingleThing;
var Thing = webthing.Thing;
var Value = webthing.Value;
var WebThingServer = webthing.server.WebThingServer;
var gpio = require('gpio');
var GpioOnOffProperty = require('./gpio-property');

/// Relate-to: https://developer.artik.io/documentation/artik-05x/getting-started/board-ref.html
function ARTIK05x(description)
{
    Thing.call(this, 'ARTIK710', 'SingleBoardComputer',
             description || "A web connected ARTIK710");
    var self = this;
  {
    self.gpioOnOffProperties = [
      new GpioOnOffProperty(this, "BlueLed", false,
                            { description: "Blue LED on ARTIK710 interposer board (on GPIO38)" },
                            { direction: gpio.DIRECTION.OUT, pin: 38}),
      new GpioOnOffProperty(this, "RedLed", false,
                            { description: "Red LED on ARTIK710 interposer board (on GPIO28)" },
                            { direction: gpio.DIRECTION.OUT, pin: 28}),
      new GpioOnOffProperty(this, "SW403", false,
                            { description: "Up Button: Nearest board edge, next to red LED (on GPIO30)"},
                            { direction: gpio.DIRECTION.IN, pin: 30}),
      new GpioOnOffProperty(this, "SW404", false,
                            { description: "Down Button: Next to blue LED (on GPIO32)"},
                            { direction: gpio.DIRECTION.IN, pin: 32}),
    ];
    self.gpioOnOffProperties.forEach(function(property) {
     self.addProperty(property);
    });
  }
  
  this.close = function() {
    self.gpioOnOffProperties.forEach(function(property) {
      property.close && property.close();
    });
  }
}

module.exports = new ARTIK05x();

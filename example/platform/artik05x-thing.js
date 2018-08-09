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
var AnalogProperty = require('./adc-property');
var GpioOnOffProperty = require('./gpio-property');

/// Relate-to: https://developer.artik.io/documentation/artik-05x/getting-started/board-ref.html
function ARTIK05x(description)
{
    Thing.call(this, 'ARTIK05x', 'SDB',
             description || "A web connected ARTIK05x");
    var self = this;
  {
    self.gpioOnOffProperties = [
      new GpioOnOffProperty(this, "BlueLed", false,
                                         { description: "Blue LED on ARTIK05x board (on GPIO45)" },
                                         { direction: gpio.DIRECTION.OUT, pin: 49}),
      new GpioOnOffProperty(this, "RedLed", false,
                            { description: "Red LED on ARTIK05x board (on GPIO45)" },
                            { direction: gpio.DIRECTION.OUT, pin: 45}),
      new GpioOnOffProperty(this, "LeftButton", false,
                            { description: "Left Button on ARTIK05x board (on GPIO42)"},
                            { direction: gpio.DIRECTION.IN, pin: 42}),
      new GpioOnOffProperty(this, "RightButton", false,
                            { description: "Right Button on ARTIK05x board (on GPIO44)"},
                            { direction: gpio.DIRECTION.IN, pin: 44}),
      new AnalogProperty(this, "ADC1", 0,
                         { description: "Analog port of ARTIK05x" },
                         { frequency: 1, adc: { device: '/dev/adc0', pin: 0}}),
      new AnalogProperty(this, "ADC2", 0,
                         { description: "Analog port of ARTIK05x" },
                         { frequency: 1, adc: { device: '/dev/adc0', pin: 1}}),
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

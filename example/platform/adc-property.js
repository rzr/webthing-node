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

var adc = require('adc');


function AdcSensorProperty(thing, name, value, metadata, config)
{
  var self = this;
  self.value = new Value(value, function(value) {
    self.handleValueChanged && self.handleValueChanged(value); //TODO
  });
  Property.call(this, thing, name, self.value,
                {
                  '@type': 'LevelProperty',
                  label: ( metadata && metadata.label) || 'Level: ' + name,
                  type: 'number',
                  description: (metadata && metadata.description) || ("ADC Sensor on pin")
                });
  {
    if (!adc || !config.adc) {
      throw "error: adc: Invalid config: " + adc;
    }
    //TODO, 1000 is working , 42 is not faster, polling about 5sec
    self.period = config.frequency && (1000. / config.frequency ) || 500.;
    self.range = config.range || 4096;
    self.port = adc.open(config.adc, function(err) {
      log("log: adc: " + self.getName() + " ready: " + err);
      if (err) {
        console.error("error: adc:" + self.getName() + ": Fail to open pin: " + config.adc.pin);
        return null;
      }
      self.inverval = setInterval(function() {
        var value = self.port.readSync();
        log("log: adc: " + self.getName() + ": update: 0x"  + Number(value).toString(16));
        value = Math.floor(100. * value / self.range);
        log("log: adc: " + self.getName() + ": update: "  + value + "%");
        if ( value !== self.lastValue ) {
          self.value.notifyOfExternalUpdate(Number(value));
        }
        self.lastValue = value;
      }, self.period);
    });
    console.log("AnalogProperty");
  }
  
  self.close = function() {
    try {
      self.inverval && clearInterval(self.inverval);
      self.port && self.port.closeSync();
    } catch(err) {
      console.error("error: adc: " + self.getName() + " close:" + err);
    }
  }

}

module.exports = AdcSensorProperty;

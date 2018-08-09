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
var adc = require('adc');

function GpioSwitchOnOffProperty(thing, name, value, metadata, config)
{
  var self = this;
  Property.call(this, thing, name,
                  new Value(value, function(value) {
                    self.handleValueChanged && self.handleValueChanged(value); //TODO
                  }),
                  {
                    '@type': 'OnOffProperty',
                    label: ( metadata && metadata.label) || 'On/Off: ' + name,
                    type: 'boolean',
                    description: (metadata && metadata.description) || ( "GPIO Switch on pin=" + config.pin )
                  });
  {
    self.port = gpio.open({
      pin: config.pin,
      direction: gpio.DIRECTION.OUT
    }, function(err) {
      log("log: gpio: " + self.getName() + ": ready? (null expected): " + err);
      if (err) {
        console.error("error: gpio: " + self.getName() + ": Fail to open: " + err);
        return err;
      }
      self.handleValueChanged = function(value) {
        try {
          log("log: gpio: " + self.getName() + ": writing: " + value);
        self.port.write(value);
        } catch(err) {
          console.error("error: gpio: " + self.getName() + ": Fail to write: " + err);
          return err;
        }
      };
    });
  }
  
  this.close = function() {
    try {
      self.port && self.port.closeSync();
    } catch(err) {
      console.error("error: gpio: " + self.getName() + ": Fail to close: " + err);
      return err;
    }
  }
  return this; //TODO
}


function GpioSensorOnOffProperty(thing, name, value, metadata, config)
{
  var self = this;
  self.value = new Value(value, function(value) {
    self.handleValueChanged && self.handleValueChanged(value); //TODO
  });
  Property.call(this, thing, name, self.value,
                {
                  '@type': 'BooleanProperty',
                  label: ( metadata && metadata.label) || 'On/Off: ' + name,
                  type: 'boolean',
                  description: (metadata && metadata.description) || ("GPIO Sensor on pin=" + config.pin)
                });
  {
    self.period = 500; //TODO, 1000 is working , 42 is not faster, polling about 5sec
    self.port = gpio.open({
      pin: config.pin,
      direction: gpio.DIRECTION.IN
    }, function(err) {
      log("log: " + self.getName() + " ready:" + err);
      if (err) {
        console.error("error: gpio:" + self.getName() + ": Fail to open pin: " + config.pin);
        return null;
      }
      self.inverval = setInterval(function() {
        var value = self.port.readSync();
        log("log: gpio: " + self.getName() + ": update: "  + value);
        if ( value !== self.lastValue ) {
          self.value.notifyOfExternalUpdate(Boolean(value));
      }
        self.lastValue = value;
      }, self.period);
    });
  }
  
  self.close = function() {
    try {
      self.inverval && clearInterval(self.inverval);
      self.port && self.port.closeSync();
    } catch(err) {
      console.error("error: gpio: " + self.getName() + " close:" + err);
    }
  }
}


function GpioOnOffProperty(thing, name, value, metadata, config)
{
  if (config.direction === gpio.DIRECTION.OUT ) {
    return new GpioSwitchOnOffProperty(thing, name, value, metadata, config)
  } else  if (config.direction === gpio.DIRECTION.IN ) {
    return new GpioSensorOnOffProperty(thing, name, value, metadata, config);
  } else {
    throw "error: Invalid param";
  }
}

module.exports = GpioOnOffProperty;

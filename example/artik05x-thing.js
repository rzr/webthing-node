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


function AnalogProperty(thing, name, value, metadata, config)
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
        value = Math.floor(100. * value / self.range);
        log("log: adc: " + self.getName() + ": update: "  + value);
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

/// Relate-to: https://developer.artik.io/documentation/artik-05x/getting-started/board-ref.html
function SingleBoardComputer(description)
{
    Thing.call(this, 'ARTIK05x', 'SDB',
             description || "A web connected SingleBoardComputer");
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
    ]
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


function runServer() {
  console.log(process);
  var port = process.argv[2] ? Number(process.argv[2]) : 80;
  var url = "http://localhost:" + port;

  console.log('Usage:\n'
              + process.argv[0] + ' ' + process.argv[1] + ' [port]\n'
              + 'Try:\ncurl -H "Accept: application/json" '
              + url + '\n');

  var thing = new SingleBoardComputer();
  var server = new WebThingServer(new SingleThing(thing, "Artik05xDevice"), port);
  process.on('SIGINT', function() {
    server.stop();
    thing && thing.close();
    process.exit();
  });

  server.start();
}

runServer();

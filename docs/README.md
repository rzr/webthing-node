# WEBTHING-IOTJS #


## INTRODUCTION: ##

Recently I shared this short video about different webthings working along

https://vimeo.com/279677314#web-of-things-agriculture-20180712rzr

This Web of Thing demo "world first smart orchid ever" is not that new, I am sure

Instead of freezing "quick and dirty" demo code.
I prefered to upstream the most I can
and then provide support on mainline.

Upstreaming can be a slow process,
so I will be also share some developement branches,
but they are expected to move, 
since I am continuously catching up upstream.

I hope those hints will inspire you to create different projects, let me know


## USAGE: ##


### PRERIQUISTE ###


Since Mozilla Gateway 0.5 has been just released,
so it should be easy to install on RaspberryPi.

I have myself managed to make the gateway running ARTIK7 (on fedora 24)
and it should run fine on others ARTIK4 natively or in a Docker container,

https://github.com/TizenTeam/gateway/tree/sandbox/rzr/devel/artik/master

I can share more hints later, just ask tell me more on your setup.


So let's stick with RaspberryPi for today,
just install image and eventually install some adapters as explained before:

https://s-opensource.org/2018/04/25/mozilla-iot-generic-sensors/


https://github.com/rzr/mozilla-iot-generic-sensors-adapter/

Check supported sensors in this high level wrapper to drivers:

https://github.com/rzr/generic-sensors-lite

For now I recommend to use either BH1650 or BMP082 modules,
community implemented drivers, 
which are suported by NPM community, 
since my fixes were upstreamed.

https://s-opensource.org/wp-content/uploads/2018/04/virtual-things-1024x795.png

### Optional: Setup webthings on ARDUINO ###

Developing webthing on ardunino or compatible platforms
such as Espressif ESP8266 or ESP32

Once your have setup build tool, 
Developing is pretty straight forward, and it has been covered earlier:

https://s-opensource.org/2018/06/21/webthing-iotjs/

https://github.com/mozilla-iot/webthing-arduino

The RGB Lamp code is upstreamed at:
https://github.com/mozilla-iot/webthing-arduino/tree/master/examples/RGBLamp

Since I shared a slightly more adavanced example that handle ADC port,
it was used to monitor the moisture of the ground of a plant.

Hardware side, I used an Arduino mega with Ethernet Shield 
(<a href='https://www.slideshare.net/SamsungOSG/iotivity-tutorial-prototyping-iot-devices-on-gnulinux/41'>same one in this IoTivity 1.2 "arduino switch" demo</a>) 
A moisture sensor is just plugged on analog pin (and +5v GND, the digital pin was not used here, but it can be used for other boards without analog like RaspberryPi and use potentientiomer as "hardware threshold").

Check code and instructions upsteam:

https://github.com/mozilla-iot/webthing-arduino/tree/master/examples/LevelSensor



### USING TIZENRT: ###

IoT.js is part of Tizen:RT, but current release is oudated, 
so it needs to be updated:


### USING IOTJS ON GNU/LINUX: ###

Only snapshot version if currently supported, 
if using GNU/Linux rebuild it from scratch or install snapshot debian packages:

https://s-opensource.org/2018/03/13/using-iotjs-raspberrypi0/


#### ON ARTIK710 ####

Several OS are supported on this device, but we'll use Ubuntu in a docker container

```
sudo=sudo
version=ubuntu:latest
$sudo docker run $version cat /etc/issue
```
TODO : make reciepe


### USING NODEJS: ###

For debuging purposes, code is also compatible with nodejs but with stubbed IO function,
in longer term I plan to align iotjs API for IO modules for node.


## REFERENCES: ##

* https://s-opensource.org/2018/06/21/webthing-iotjs/
* https://s-opensource.org/2018/03/13/using-iotjs-raspberrypi0/

# WEBTHING-IOTJS #

* URL: https://github.com/TizenTeam/webthing-node/tree/sandbox/rzr/devel/artik/master/docs
* Support: https://github.com/TizenTeam/webthing-node/issues


## STATUS: WORK IN PROGRESS ##

Expected to be presented at MozFest 2018

* https://github.com/MozillaFestival/mozfest-program-2018/issues/690


## DEMO: ##

Recently I shared this short video about different webthings working along.

Many technologies were involved, among them webthing-iotjs (ARTIK's LED at end of video)

This Web of Thing demo "world first smart orchid ever" is not that new, I am sure
but I hope those hints will inspire you to create different projects, let it know.


[![web-of-things-agriculture-20180712rzr.webm](https://s-opensource.org/wp-content/uploads/2018/07/web-of-things-agriculture-20180712rzr.gif)](https://player.vimeo.com/video/279677314#web-of-things-agriculture-20180712rzr.webm "Video Demo")

* https://player.vimeo.com/video/279677314#web-of-things-agriculture-20180712rzr.webm


## DISCLAIMER ##

This guide will focus only using iotjs to build webthings.

Instead of freezing "quick and dirty" demo code.
I preferred to upstream the most I can
and then provide support on mainline branches.

Upstreaming can be a slow process,
so I will be also share some development branches,
but they are expected to move,
since I am continuously catching up upstream.



## INTRODUCTION: ##

Webthing-iotjs is a fork of webthing-node adapted for IoT.js runtime.

It's functional but has some limitations that worth to be known:

* MDNS is not supported yet, so no auto discovery of devices
* Websockets are not implemented yet, while IoT.js recently introduced WS, it's not used yet.
* Actions and Events are also dropped as not critical.

![ARTIK05x](https://camo.githubusercontent.com/c3db9783f1c00fe24ac29d19d007b9b9c0bddb24/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f446a716f4a56415734414577354a342e6a7067)


An other MCU/MPU target to consider is ARTIK05x, as shown at end of demo,
you could try to compare to Arduino, but I wouldn't dare.
It's running a full featured OS, called Tizen:RT,
don't confuse with Linux Based Tizen, this one has a different kernel
and is targetting lower class architecture.

One key feature of Tizen:RT is "native javascript" support, using
JerryScript and IoT.js runtime.

Because IoT.js try to allign the most to nodejs's design and conventions
I was tempted to try to port the Mozilla's webthing-node SDK to
IoT.js and it worked !

Note that features were removed, and the code has been downgraded to earlier ECMA standards, since the code base was very small that task was done manually to avoid generated overhead using transpiliers such as babel.


## USAGE: ##

* Setup gateway as explained at: https://iot.mozilla.org/gateway/
* Add thing URL adapter
* Deploy iotjs on supported devices
* Run webthing example on target device
* Add thing by URL from gateway's UI.

See next chapters for details.


### PREREQUISITE: SETUP MOZILLA IOT GATEWAY ###

Since Mozilla Gateway 0.5 has been just released,
so it should be easy to install on RaspberryPi.

* TODO: There is bug in current (or all previous) release 
  with several properties of same patch,
  so the gateway should be rebuild until my patch is merged:

  * https://github.com/mozilla-iot/gateway/issues/1148
  * https://github.com/mozilla-iot/gateway/pull/1249
  * https://github.com/tizenteam/gateway

Once installed, you can check by installing "virtual-adapter" as explained before:

* https://s-opensource.org/2018/04/25/mozilla-iot-generic-sensors/

![virtual-things](https://s-opensource.org/wp-content/uploads/2018/04/virtual-things-1024x795.png)


#### MOZILLA IOT GATEWAY ON RASPBERRYPI (RASPBIAN): ####

Just install released image on RaspberryPi 2 or 3,


#### MOZILLA IOT GATEWAY ON GNU/LINUX: ####


* TODO: document


#### MOZILLA IOT GATEWAY ON DOCKER: ####

While developping I made my owndocker file

* TODO upstream

For deeper integration, maybe you should try out 
upstream's docker images:

* https://github.com/mozilla-iot/gateway-docker


```shell
sudo docker run mozillaiot/gateway:arm

sudo docker run \
    -d \
    --rm \
    --net=host \
    --name mozilla-iot-gateway \
    mozillaiot/gateway:arm
```

On benefit of having docker files in sources, 
is that project can be built on reference OS,
and be deployed on any as long as docker is supported.

* TODO: document


```bash
sudo=sudo # unless docker properly configured
project="webthing-node"
url="https://github.com/tizenteam/${project}"
branch="sandbox/rzr/devel/artik/master"
git clone --recursive --depth 1 -b "$branch" "$url" ; cd "$project"
image="debian:latest"
sed -e "s/^FROM .*/FROM $image/g" -i Dockerfile
time $sudo docker-compose up
```

#### MOZILLA IOT GATEWAY ON DOCKER ARMv7 (TODO) ####

```shell
sudo=sudo # unless docker properly configured
project="webthing-node"
url="https://github.com/tizenteam/${project}"
branch="sandbox/rzr/devel/artik/master"
git clone --recursive --depth 1 -b "$branch" "$url" ; cd "$project"
image="debian:latest"
sed -e "s/^FROM .*/FROM $image/g" -i Dockerfile
time $sudo docker-compose up
```

Build step can be a bit intensive,
because some packages like sqlite3 
are only distribuated as source 


* TODO: fix sqlite on node10
  * https://github.com/mapbox/node-sqlite3/issues/994
  * https://github.com/TizenTeam/node-sqlite3
  * https://github.com/mapbox/node-sqlite3/issues/418
  * https://github.com/mapbox/node-sqlite3/pull/1028


#### MOZILLA IOT GATEWAY ON ARTIK710 (TODO) ####


ARTIK 5,7 or even 10 should be able to support Mozilla-IoT's gateway
which was originaly targetting RaspberryPi as reference platform and thus Raspbian OS.

My <a href='https://www.artik.io/modules/artik-710/'>ARTIK710</a> was shipped on Fedora-24 
(
<a href='https://s-opensource.org/2017/11/29/building-iotivity-arm-artik-devices/'>
the same OS I build IoTivity 1.3.1 package for
</a>
)

I have myself managed to make the gateway running ARTIK7 (on fedora 24)
and it should run fine on others (ARTIK5) natively in a Docker container.


I managed to rebuild Mozilla's IoT using node TODO,
a couple of fixes were needed and are already upstreamed <a href='https://github.com/mozilla-iot/gateway/pull/1206'>hardcoded path or environment issues</a>, but didn't land in latest release 0.5.0.

I think that latest ARTIK images switched to Ubuntu, so I will be even easier to migrate from Raspbian as both are debian based.

* TODO : document support
* https://github.com/TizenTeam/gateway/tree/sandbox/rzr/devel/artik/master

Optionally, If you have the interposer board you can also try out 
the generic sensor adapter ARM binaries should work too:

* https://s-opensource.org/2018/04/25/mozilla-iot-generic-sensors/

#### MOZILLA IOT ON OTHERS: ####

I can share more hints later, just ask, tell me more on your setup.



### USING IOTJS ON GNU/LINUX: ###

Only snapshot version if currently supported,
if using GNU/Linux rebuild it from scratch or install snapshot debian packages:


#### IOTJS ON DEBIAN: ####

Even if iotjs-1.0 landed in debian,
we'll use a snapshot version
(<a href='https://github.com/Samsung/iotjs/pull/1400'>to enable all features in full profile</a>)

* https://packages.qa.debian.org/i/iotjs.html
* https://build.opensuse.org/package/show/home:rzrfreefr:snapshot/iotjs


#### IOTJS ON ARTIK710: ####

Several OS are supported on this device, mine was on Fedora-24, now support moved to Ubuntu,
some might also use Tizen too,
So for now we'll use Debian in a docker container mounted on external USB disk (4GB) and an other for swap

```shell
cat /etc/os-release # PRETTY_NAME="Fedora 24 (Twenty Four)"
sudo=sudo # Or configure your sudoers
$sudo sync
$sudo dnf install docker screen time git etckeeper jq
screen # Press "Ctrl+a c" : to open a new terminal

$sudo systemctl stop docker
part="/dev/sda1" # TODO: updated if needed
mnt="/var/lib/docker"
$sudo mkfs.ext4 -L webthings "$part" # TODO: verify $part variable

$sudo mkdir -p "$mnt"
$sudo mount "$part" "$mnt"
swap=/dev/sdb1
$sudo mkswap $swap
$sudo swapon $swap
free
$sudo systemctl restart docker
$sudo docker version # docker-common-1.10.3-55.gite03ddb8.fc24.armv7hl
```

Then build container and start service (500 Mb will be used):

```bash
project="webthing-node"
url="https://github.com/tizenteam/${project}"
branch="sandbox/rzr/devel/artik/master"
git clone --recursive --depth 1 -b "$branch" "$url" ; cd "$project"
image="arm32v7/debian"
sed -e "s/^FROM .*/FROM $image/g" -i Dockerfile
time sudo docker-compose up # 17min to build and run
```

Expected log:
```
Recreating webthingnode_web_1
Attaching to webthingnode_web_1
web_1  | log: Loading platform: artik710
web_1  | Usage:
web_1  | /usr/bin/iotjs example/platform/index.js [port]
web_1  | Try:
web_1  | curl -H "Accept: application/json" http://localhost:8888
web_1  |
web_1  | log: SW404 ready:null
web_1  | log: SW403 ready:null
web_1  | log: gpio: RedLed: ready? (null expected): null
web_1  | log: gpio: BlueLed: ready? (null expected): null
web_1  | log: gpio: SW404: update: true
(...)
web_1  | log: gpio: BlueLed: writing: true
(...)
(... user hit Ctrl+C ...)
Gracefully stopping... (press Ctrl+C again to force)
Stopping webthingnode_web_1 ...
Stopping webthingnode_web_1 ... done
```

Test in an other shell:


curl http://localhost:8888 | jq

```javascript
{
"name": "ARTIK710",
"href": "/",
"type": "SingleBoardComputer",
"properties": {
"BlueLed": {
"@type": "OnOffProperty",
"label": "On/Off: BlueLed",
"type": "boolean",
"description": "Blue LED on ARTIK710 interposer board (on GPIO38)",
"href": "/properties/BlueLed"
},
"RedLed": {
"@type": "OnOffProperty",
"label": "On/Off: RedLed",
"type": "boolean",
"description": "Red LED on ARTIK710 interposer board (on GPIO28)",
"href": "/properties/RedLed"
},
"SW403": {
"@type": "BooleanProperty",
"label": "On/Off: SW403",
"type": "boolean",
"description": "Up Button: Nearest board edge, next to red LED (on GPIO30)",
"href": "/properties/SW403"
},
"SW404": {
"@type": "BooleanProperty",
"label": "On/Off: SW404",
"type": "boolean",
"description": "Down Button: Next to blue LED (on GPIO32)",
"href": "/properties/SW404"
}
},
"links": [
{
"rel": "properties",
"href": "/properties"
}
],
"description": "A web connected ARTIK710"
}
```

TODO: Fix to support schemas:

* https://iot.mozilla.org/schemas/


#### WEBTHING-IOTJS ON RASPBIAN: ####

Just install IoT.js

* https://s-opensource.org/2018/03/13/using-iotjs-raspberrypi0/
* https://dl.bintray.com/rzr/raspbian-9-armhf/

See general instructions above


https://www.tindie.com/products/anavi/anavi-flex-raspberry-pi-hat-for-iot/

https://github.com/AnaviTechnology/anavi-flex/issues/1#issuecomment-274616910

#### WEBTHING-IOTJS ON DOCKER: ####

* https://hub.docker.com/_/debian/


#### WEBTHING-IOTJS ON INTEL EDISON: ###

Like previously explained on Edison, you can also try a blinky example on x86:

* https://s-opensource.org/2018/06/21/webthing-iotjs/


### IOTJS ON TIZENRT: ###

IoT.js is part of Tizen:RT, but current release is outdated,
so it needs to be updated:

then you need to Enable this iotjs_startup on boot
https://github.com/Samsung/TizenRT/pull/1982

Or start on existing "iotjs" configuration for ARTIK:

https://github.com/Samsung/TizenRT/pull/2009

* TODO: Track upstreaming:
  * https://github.com/Samsung/TizenRT/pull/2018
  * https://github.com/TizenTeam/TizenRT
  * https://github.com/TizenTeam/libtuv


To rebuild Tizen:RT with IoT.js 
my upstreamed luncher app should be enabled,
ROMfs enabled, WiFi configured.

And javascripts placed in contents subdir.


#### WEBTHING-IOTJS ON ARTIK05X: ###

I made some script helpers to rebuild it all with a single make command,
this work is still in progress.

```shell
project="tizenrt"
url="https://github.com/tizenteam/tizenrt"
branch="sandbox/rzr/devel/webthing/master"
git clone --recursive --depth 1 -b "$branch" "$url" ; cd "$project"
make demo

```


### USING NODEJS: ###

For debugging purposes, code is also compatible with nodejs but with stubbed IO functions,
in longer term I plan to align iotjs API for IO modules for node.

TODO: upstream into webthing-node (reusable part)

* https://github.com/TizenTeam/GpiO


### EXTRA: USING SENSORS AND ACTUATORS: ###

"Smart Orchid Demo" showed a clapsensor, which is bascially just a GPIO input of KY-037's digital pin,

* https://github.com/TizenTeam/webthing-node/blob/sandbox/rzr/devel/artik/master/example/toggle-gpio-binary-sensor-thing.js

TODO: This part is not ready, as some changes are not merged upstream

* https://github.com/rzr/mozilla-iot-generic-sensors-adapter/

Check supported sensors in this high level wrapper to drivers:

* https://github.com/rzr/generic-sensors-lite

For now I recommend to use either BH1650 or BMP082 modules,
community implemented drivers,
which are supported by NPM community,
since my fixes were upstreamed.


#### IO RESOURCES: ####

* https://github.com/TizenTeam/addon-list
* https://github.com/TizenTeam/node-blinkt
* https://github.com/TizenTeam/iotjs-modules
* https://github.com/rzr/iotjs-async
* https://github.com/TizenTeam/bmp085-sensor
* https://github.com/TizenTeam/bmp085
* https://github.com/TizenTeam/bh1750
* https://github.com/TizenTeam/gateway


### EXTRA: ARDUINO AND ESP ###


Developing webthing on Arduino APIs or compatible platforms
such as Espressif ESP8266 or ESP32

Once your have setup build tool,
Developing is pretty straight forward, and it has been covered earlier:

* https://s-opensource.org/2018/06/21/webthing-iotjs/
* https://github.com/mozilla-iot/webthing-arduino

"Smart Orchid Demo" showed a light controller and arduino moisture sensor:

The RGB Lamp code is upstreamed at:

* https://github.com/mozilla-iot/webthing-arduino/tree/master/examples/RGBLamp

Since I shared a slightly more advanced example that handle ADC port,
it was used to monitor the moisture of the ground of a plant.

* https://github.com/mozilla-iot/webthing-arduino/tree/master/examples/LevelSensor

Hardware side, I used an Arduino mega with Ethernet Shield
(<a href='https://www.slideshare.net/SamsungOSG/iotivity-tutorial-prototyping-iot-devices-on-gnulinux/41'>same one in this IoTivity 1.2 "arduino switch" demo</a>)

A moisture sensor is just plugged on analog pin (and +5v GND, the digital pin was not used here, but it can be used for other boards without analog like RaspberryPi and use potentiometer as "hardware threshold").

* TODO: refactor to handle Arduino's WiFi shield too

* TODO: port iotjs to arduino and compare perfs

For reference code was developed in this repo: (but most of it is upstreamed)

* https://github.com/TizenTeam/webthing-esp8266


### EXTRA: ACTIVITY PUB: ###

For the notification service, I relied on W3C Activity Pub

I made a simple Command line client to the mastodon network,
https://github.com/rzr/mastodon-lite

If you want to use earlier GNU social instance
it should work same or be easy to adapt.

Then I implemented a thing:

* https://www.npmjs.com/package/mastodon-lite
* https://github.com/TizenTeam/webthing-node/blob/sandbox/rzr/devel/artik/master/example/actuator-mastodon.js
* https://github.com/TizenTeam/webthing-node/blob/sandbox/rzr/devel/artik/master/example/mastodon-thing.js


* TODO: Create adapter for gateway

### EXTRA: WEBTHINGS-WEBAPP: ###

For front end developers, can also try this webapp 
originally designed as Tizen app (wgt)
* https://s-opensource.org/2018/06/21/webthing-iotjs/

It was tested on Tizen:5 on TM1,
WiFi needs to be enabled again, 
it's not trivial but I shared some hints on Tizen's wiki:

* https://wiki.tizen.org/TM1#tizen-5

Some patches are still under review:

* https://review.tizen.org/gerrit/#/c/181349/

Earlier Tizen's version might not work because mozilla's gateway UI
is expecting recent browsers.

* https://bugs.tizen.org/browse/TRE-1963

Then the application was then "ported" to Android
for Samsung Internet browser.

Since PWA was supported in Tizen, so
I should worth a try on updated version.

Used repository:

* https://github.com/rzr/webthings-webapp
* https://github.com/tizenteam/webthings-webapp


## TODO: ##

* Fix Things description
* Upstream the most I can to webthing-node
* Rename webthing-node to webthing-iotjs
* Relocate to https://github.com/rzr/webthing-iotjs
* Transpile webthing-node for IoT.js (using babel?)
* Support Tizen


## RESOURCES: ##

* https://s-opensource.org/2018/06/21/webthing-iotjs/
* http://www.iotjs.net/
* https://www.artik.io/
* https://github.com/Samsung/TizenRT
* https://github.com/Samsung/TizenRT/blob/master/docs/HowToUseIoTjs.md
* https://www.slideshare.net/SamsungOSG/the-complex-iot-equation-and-floss-solutions-101449596/10
* https://iot.mozilla.org/
* https://iot.mozilla.org/wot/
* irc://irc.mozilla.org/#iot
* https://wiki.tizen.org/User:Pcoval
* https://s-opensource.org/author/philcovalsamsungcom/
* https://s-opensource.org/tag/iotjs
* https://s-opensource.org/tag/wot
* https://s-opensource.org/tag/mozilla
* https://s-opensource.org/category/internet-of-things/
* https://www.npmjs.com/~rzr
* https://github.com/Samsung/iotjs/wiki/Build-for-ARTIK053-TizenRT
* https://archive.fosdem.org/2018/schedule/event/tizen_rt/
* https://www.slideshare.net/SamsungOSG/tizen-rt-a-lightweight-rtos-platform-for-lowend-iot-devices
* https://source.tizen.org/documentation/tizen-rt/tizen-rt-long-term-goals

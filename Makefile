#!/bin/make -f

main ?= example/platform/index.js

default: run/iotjs

run/iotjs: ${main}
	iotjs $<

run/node: ${main}
	NODE_PATH=.:extra node $<

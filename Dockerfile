#!/bin/echo docker build . -f
# -*- coding: utf-8 -*-
# SPDX-License-Identifier: MPL-2.0
#{ 
# Copyright 2018-present Samsung Electronics France SAS, and other contributors
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.*
#}

#TODO: If needed comment default OS (debian:latest) and add yours (ie: arm32v7/debian)
#FROM debian:latest
FROM arm32v7/debian

MAINTAINER Philippe Coval (p.coval@samsung.com)

ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL en_US.UTF-8
ENV LANG ${LC_ALL}

RUN echo "#log: Configuring locales" \
  && set -x \
  && apt-get update -y \
  && apt-get install -y locales \
  && echo "${LC_ALL} UTF-8" | tee /etc/locale.gen \
  && locale-gen ${LC_ALL} \
  && dpkg-reconfigure locales \
  && sync

ENV project webthing-iotjs

RUN echo "#log: ${project}: Setup system" \
  && set -x \
  && apt-get update -y \
  && apt-get install -y sudo apt-transport-https curl gnupg \
  && apt-cache show iotjs || echo "TODO: iotjs is in Debian "buster" (testing) ! "\
  && apt-get clean \
  && sync

RUN echo "#log: ${project}: Setup system: Install iotjs" \
  && set -x \
  && sudo apt-get update -y \
  && sudo apt-get install -y gnupg  \
  && cat /etc/os-release \
  && distro="Debian_9.0" \
  && url="http://download.opensuse.org/repositories/home:/rzrfreefr:/snapshot/$distro" \
  && file="/etc/apt/sources.list.d/org_opensuse_home_rzrfreefr_snapshot.list" \
  && echo "deb [allow-insecure=yes] $url /" | sudo tee "$file" \
  && curl "$url/Release.key" | apt-key add - \
  && sudo apt-get update -y \
  && apt-cache show iotjs \
  && apt-cache show iotjs-snapshot \
  && package=iotjs-snapshot \
  && version=$(apt-cache show "$package" | grep 'Version:' | cut -d' ' -f2 | sort -n | head -n1 || echo 0) \
  && sudo apt-get install -y --allow-unauthenticated iotjs-snapshot=$version iotjs=$version \
  && sync

ADD . /usr/local/${project}/${project}
WORKDIR /usr/local/${project}/${project}
RUN echo "#log: ${project}: Preparing sources" \
  && set -x \
  && ls \
  && cat example/platform/index.js \
  && sync

EXPOSE 8888
WORKDIR /usr/local/${project}/${project}
CMD [ "/usr/bin/iotjs" "example/platform/index.js"]

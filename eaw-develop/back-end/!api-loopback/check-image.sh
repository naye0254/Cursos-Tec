#!/bin/bash

if [ ! -z $(docker images -q eaw-api-loopback:latest) ]
then
  echo "[Found] Docker image for eaw-api-loopback does exist!"
else
	echo "[Not found] Docker image for eaw-api-loopback does not exist! Creating..."
	docker build -t eaw-api-loopback:latest .
	echo "[Created] Docker image for eaw-api-loopback has been created!"
fi

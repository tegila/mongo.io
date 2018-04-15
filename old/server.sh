#!/bin/sh

NODE_ENV="production"
PORT="7070"
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/"
APP_NAME=${PWD##*/}
NODE_APP="server.coffee"
CONFIG_DIR="$APP_DIR"
PID_DIR="/tmp"
PID_FILE="$PID_DIR/$APP_NAME.pid"
LOG_DIR="/var/log"
LOG_FILE="$LOG_DIR/$APP_NAME.log"
NODE_EXEC=$(which coffee)

source "$APP_DIR/../nodejs.sh"
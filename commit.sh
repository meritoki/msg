#!/bin/sh
. "$(dirname $0)/vars.sh"
MESSAGE=$1
sudo git status
sudo git add .
sudo git commit -a -m"v$VERSION.$ID $MESSAGE"
sudo git tag -f -a $TAG -m${TAG}

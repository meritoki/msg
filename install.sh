#!/bin/bash
. "$(dirname $0)/vars.sh"
command -v node >/dev/null 2>&1 || { echo >&2 "Require Node.  Aborting."; exit 1; }
EXIT=false
PROGRAM=web
test -d $LOG_PATH || sudo mkdir -p $LOG_PATH
sudo touch $LOG_PATH/app.express
sudo touch $LOG_PATH/app.console
if [ ! -d "${ROOT}" ]
then
sudo mkdir -p $ROOT
fi
npm install
if [ ! -L "$LINK" ]
then
sudo ln -s $INSTALL $LINK
else
sudo rm -r $LINK
sudo ln -s $INSTALL $LINK
fi
case "$1" in
    service)
      sudo systemctl stop $PROGRAM
      sudo systemctl disable $PROGRAM
      sudo systemctl daemon-reload
      sudo systemctl reset-failed
      sudo rm /lib/systemd/system/$PROGRAM.service
      sudo cp ./controller/configuration/$PROGRAM.service /lib/systemd/system/
      sudo systemctl daemon-reload
      sudo systemctl start $PROGRAM
      sudo systemctl status $PROGRAM
      sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
      sudo iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8443
    ;;
esac
#./log.sh

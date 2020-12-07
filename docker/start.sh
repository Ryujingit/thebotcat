#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
sudo docker run -it --name thebotcat \
  --mount type=bind,source=../props.json,target=/home/thebotcat/props.json \
  thebotcat/thebotcat
./stop.sh

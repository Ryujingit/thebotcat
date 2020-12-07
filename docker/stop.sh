#!/bin/bash
cd "$(dirname "${BASH_SOURCE[0]}")"
sudo docker stop -t 0 thebotcat
sudo docker container rm thebotcat

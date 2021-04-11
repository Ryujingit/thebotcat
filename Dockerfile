FROM node:15

RUN apt update && apt -y upgrade
RUN apt -y install ffmpeg

RUN adduser thebotcat -u 2201
USER thebotcat
WORKDIR /home/thebotcat

RUN [ "touch", "/home/thebotcat/props.json" ]
RUN [ "mkdir", "/home/thebotcat/folder" ]
RUN [ "mkfifo", "/home/thebotcat/replinp" ]
RUN [ "mkfifo", "/home/thebotcat/replout" ]
RUN [ "mkfifo", "/home/thebotcat/dpipe" ]

COPY ./math.min.js /home/thebotcat/math.min.js

# copy package.json in but only the dependencies at first
COPY ./package-basic.json /home/thebotcat/package.json
RUN npm install -f

COPY ./package.json /home/thebotcat/package.json

COPY ./.env /home/thebotcat/.env

COPY ./worker.js /home/thebotcat/worker.js
COPY ./common /home/thebotcat/common
COPY ./commands /home/thebotcat/commands
COPY ./index.js /home/thebotcat/index.js

#RUN [ "sed", "-i", "s/version: 'canary'/version: 'normal'/", "/home/thebotcat/index.js" ]

CMD node index.js

FROM node:14
WORKDIR /home/thebotcat
RUN apt update && apt -y upgrade
RUN apt -y install ffmpeg
COPY ./node_modules /home/thebotcat/node_modules
RUN npm install @discordjs/opus
COPY ./math.min.js /home/thebotcat/math.min.js
RUN [ "touch", "/home/thebotcat/props.json" ]
RUN [ "mkfifo", "/home/thebotcat/replinp" ]
RUN [ "mkfifo", "/home/thebotcat/replout" ]
RUN [ "mkdir", "/home/thebotcat/folder" ]
RUN [ "mkfifo", "/home/thebotcat/dpipe" ]
COPY ./key.pem /home/thebotcat/key.pem
COPY ./cert.pem /home/thebotcat/cert.pem
COPY ./.env /home/thebotcat/.env
COPY ./props-backup.json /home/thebotcat/props-backup.json
COPY ./package-lock.json /home/thebotcat/package-lock.json
COPY ./package.json /home/thebotcat/package.json
COPY ./worker.js /home/thebotcat/worker.js
COPY ./common /home/thebotcat/common
COPY ./commands /home/thebotcat/commands
COPY ./index.js /home/thebotcat/index.js
#RUN [ "sed", "-i", "s/version: 'canary'/version: 'normal'/", "/home/thebotcat/index.js" ]
CMD node index.js

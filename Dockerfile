FROM node:latest


ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /bot

COPY package.json /bot
RUN npm install && npm install typescript -g

COPY . /bot/

RUN tsc
CMD ["node", "dist/main.js"]
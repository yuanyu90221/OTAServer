FROM node:8.7

RUN mkdir /usr/app

WORKDIR /usr/app

RUN npm install --production

CMD ["node","www.js"]
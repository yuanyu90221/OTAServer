FROM node:8.7

RUN mkdir /usr/app

COPY . /usr/app/

WORKDIR /usr/app

RUN npm install --production

EXPOSE 7000

CMD ["node","www.js"]
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . /app

EXPOSE 9000
CMD [ "yarn", "start" ]
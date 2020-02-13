# base image
FROM node:13-alpine

WORKDIR /client

RUN yarn install

COPY ./client /client

# start client
CMD ["yarn", "start"]
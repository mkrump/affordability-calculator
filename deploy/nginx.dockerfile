FROM node:13 AS jsbuilder

COPY ./client /client
WORKDIR /client

RUN yarn install
RUN yarn build

FROM nginx:1.17-alpine

COPY ./deploy/ngnix.conf /etc/nginx/nginx.conf

COPY --from=jsbuilder /client/build/ app/
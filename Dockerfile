FROM node:8-alpine
WORKDIR /
COPY package.json /
RUN apk add git
RUN apk add nano
RUN npm install
COPY ./ /
CMD node index.js
EXPOSE 3000

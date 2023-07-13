FROM node:16
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./diste
EXPOSE 5000
CMD npm start
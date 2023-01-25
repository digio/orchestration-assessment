FROM node:lts-alpine
WORKDIR /microservices-app
COPY microservices-app/package*.json ./
RUN npm i
COPY microservices-app/ .
EXPOSE 4000
CMD [ "node", "./bin/www" ]

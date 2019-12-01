FROM node:12.10.0-alpine
RUN apk update && apk upgrade && apk --no-cache add --virtual builds-deps build-base python
RUN npm i -g npm
WORKDIR /api
COPY ./package.json /api/package.json
RUN npm --unsafe-perm install
COPY . /api
RUN npm run build
EXPOSE 3000
CMD [ "npm", "run", "prod" ]
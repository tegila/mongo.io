FROM node:alpine

RUN \
 echo "**** install runtime packages ****" && \
 apk add --no-cache \
  openssl \
  
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /server/package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./server/ .

EXPOSE 3000
CMD [ "node", "index.js" ]
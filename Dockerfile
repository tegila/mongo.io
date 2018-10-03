FROM node:alpine

# Create app directory
WORKDIR /usr/src/app/server

RUN \
 echo "**** install runtime packages ****" && \
 apk add --no-cache \
  openssl && \
  openssl req -nodes -newkey rsa:2048 -keyout cert.pem -out cert_csr.pem -subj "/C=GB/ST=London/L=London/O=Global Security/OU=IT Department/CN=example.com" && \
  openssl x509 -req -days 365 -in cert_csr.pem -signkey cert.pem -out cert.crt

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /server/package*.json ./

# If you are building your code for production
# RUN npm install --only=production
RUN yarn install

WORKDIR /usr/src/app
# Bundle app source
COPY . .

WORKDIR /usr/src/app/server
CMD [ "node", "index.js" ]

EXPOSE 3000
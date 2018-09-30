FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

RUN \
 echo "**** install runtime packages ****" && \
 apk add --no-cache \
  openssl && \
  #openssl genrsa 1024 > cert.pem && \
  #openssl req -batch -new -key cert.pem -out cert_csr.pem && \
  openssl req -nodes -newkey rsa:2048 -keyout cert.pem -out cert_csr.pem -subj "/C=GB/ST=London/L=London/O=Global Security/OU=IT Department/CN=example.com" && \
  openssl x509 -req -days 365 -in cert_csr.pem -signkey cert.pem -out cert.crt



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
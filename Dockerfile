FROM node:alpine

# Create app directory
WORKDIR /usr/src/app/server

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
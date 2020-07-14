FROM node:carbon-alpine

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN set -x \
 && printf -- "strict-ssl=false\nproxy=http://proxyunix:x92015pnuSFW@proxy.sanitas.dom:8080\nhttps-proxy=http://proxyunix:x92015pnuSFW@proxy.sanitas.dom:8080" > ~/.npmrc \
 && npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]

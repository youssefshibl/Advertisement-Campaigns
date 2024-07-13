#make docker file to node js app express

FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]


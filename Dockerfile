# Use the official Node.js image based on Alpine Linux
FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]


# FROM node:18

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install
# # If you are building your code for production
# # RUN npm ci --omit=dev

# # Bundle app source
# COPY . .

# EXPOSE 8080
# CMD [ "node", "index.js" ]

# docker build . -t dev/esn-backend
# docker save -o d:/workspace/esn/esn-backend-1.0.0-SNAPSHOT.tar dev/esn-backend:latest
#!/bin/bash
# docker load -i d:/workspace/esn/esn-backend-1.0.0-SNAPSHOT.tar
#wait
# docker container stop esn-backend
#wait
# docker container rm esn-backend
#wait
# docker run -d -p 8080:8080 --restart always --name esn-backend --log-opt max-size=10m --log-opt max-file=3 dev/esn-backend
#
# docker logs -f esn-backend

#  docker run -d -p 5672:5672 -p 15672:15672 --restart always --hostname my-rabbit --name esn-rabbit -e RABBITMQ_DEFAULT_USER=esn -e RABBITMQ_DEFAULT_PASS=esn123 rabbitmq:3-management

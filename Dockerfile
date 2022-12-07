# From the base image node
FROM node:latest

#Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/app

#Setting working directory in the container
WORKDIR /usr/src/app

#copying the package.json file(contains dependencies) from project source dir to container dir
COPY package.json /usr/src/app

# Install all dependencies
RUN npm install

#copying the source code of Application into the container dir
COPY . /usr/src/app

# Build typescript
RUN npx tsc

# Expose the port
EXPOSE 5500

# Command to execute when the image is instantiated
CMD ["npm", "start"]
# Use the latest NodeJs Image

FROM node:20.19.5-alpine

# Set Working Directory inside the container
WORKDIR /usr/src/app

# COPY package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm Install

# COPY the rest of the app
COPY . . 

# Build the project
RUN npm run build

# EXPOSE the app Port. 
EXPOSE 3001

# Run the Application
CMD [ "npm", "start"]



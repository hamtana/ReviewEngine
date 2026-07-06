# Use the latest NodeJs Image

FROM node:24-alpine

# Set Working Directory inside the container
WORKDIR /usr/src/app

# COPY package.json and pnpm-lock.yaml first
COPY package.json pnpm-lock.yaml ./

# Enable pnpm and install dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# COPY the rest of the app
COPY . . 

# Build the project
RUN pnpm build

# EXPOSE the app Port. 
EXPOSE 3001

# Run the Application
CMD [ "pnpm", "start"]



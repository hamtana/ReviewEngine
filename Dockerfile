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

# Ensure curl is installed in the alpine image
RUN apk add --no-cache curl

# Build the project
RUN pnpm build

# EXPOSE the app Port. 
EXPOSE 3001

# Configure the health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Run the Application
CMD ["pnpm", "start"]



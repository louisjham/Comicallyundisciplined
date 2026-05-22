# Use Node 22 as specified in your devDependencies
FROM node:22-slim

# Create app directory
WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Run the build script (Vite + esbuild)
RUN npm run build

# The app listens on port 3000 by default (per your previous revision config)
EXPOSE 3000

# Start the server using the built file
CMD [ "npm", "start" ]

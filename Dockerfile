# Use the official Node.js version 14 image as the base
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies with npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the initialization script into the database initialization directory
COPY init.sql /docker-entrypoint-initdb.d/

# Expose port 3000 for external access
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]

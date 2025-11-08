# Use a lightweight Node.js image
FROM node:18-alpine  

# Set the working directory inside the container
WORKDIR /app  

# Copy package.json and package-lock.json first (to cache dependencies)
COPY package*.json ./  

# Install dependencies
RUN npm install  

# Copy all files from your local project to the container
COPY . .  

# Expose the port your backend runs on
EXPOSE 5000  

# Command to start the backend server
CMD ["npm", "start"]

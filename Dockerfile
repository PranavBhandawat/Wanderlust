# Pinned Node version
FROM node:20

# Create and work in /app inside the container
WORKDIR /app

# Copy package files first (enables caching of npm install)
COPY package*.json ./

# Install dependencies fresh inside the container
RUN npm install

# Copy the rest of your source code
COPY . .

# Your app's port — change if app.js listens on something other than 8080
EXPOSE 8080

# Start your app (your entry file is app.js)
CMD ["node", "app.js"]
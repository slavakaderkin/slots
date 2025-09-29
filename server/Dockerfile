FROM node:24.7.0
WORKDIR /usr/server
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
EXPOSE 8001
EXPOSE 8002
EXPOSE 8443
CMD ["node", "server.js"]

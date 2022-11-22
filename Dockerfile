FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
EXPOSE 8080
COPY . .
CMD ["node", "./index.js" ]
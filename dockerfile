FROM node:16

EXPOSE 3002

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
    
CMD ["node", "index.js"]

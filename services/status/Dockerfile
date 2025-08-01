FROM node:22-alpine3.21
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 5002
CMD ["node", "index.js"]

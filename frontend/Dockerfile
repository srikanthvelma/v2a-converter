FROM node:22-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install axios
RUN npm install --omit=dev
COPY . .
RUN npm run build

FROM node:22-alpine3.21
WORKDIR /app
COPY --from=build /app/ .
RUN npm instal -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]

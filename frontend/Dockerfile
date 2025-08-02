FROM node:22-alpine3.21 AS build
WORKDIR /app
RUN npm install uuid axios
COPY package*.json ./
RUN npm install uuid axios
RUN npm install
COPY . .
RUN npm run build

FROM node:22-bullseye-slim AS prod
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
FROM node:22-alpine3.21 AS build
ARG REACT_APP_API_BASE
ARG REACT_APP_STATUS_BASE
ARG REACT_APP_DOWNLOAD_BASE
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine3.21
WORKDIR /app
RUN npm instal -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]

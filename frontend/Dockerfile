FROM node:22 AS builder
WORKDIR /usr/src/app
COPY ./frontend/package.json /usr/src/app/package.json
RUN yarn
COPY ./frontend /usr/src/app
COPY ./content /usr/src/app/content
RUN npm run build

FROM nginx
WORKDIR /app/frontend
COPY --from=builder /usr/src/app/dist ./

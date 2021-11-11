FROM node:16 AS builder
WORKDIR /usr/src/app
COPY ./content /usr/src/content
COPY ./frontend /usr/src/app
RUN yarn
RUN npm run build

FROM nginx
WORKDIR /app/frontend
COPY --from=builder /usr/src/app/dist ./

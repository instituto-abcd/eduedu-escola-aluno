FROM node:18 AS builder
WORKDIR /app

ARG ARG_VITE_API_URL
ARG ARG_VITE_ASSETS

ENV VITE_API_URL=${ARG_VITE_API_URL}
ENV VITE_ASSETS=${ARG_VITE_ASSETS}
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY . .

RUN yarn install
RUN yarn vite build

FROM nginx:1.16.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./.nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
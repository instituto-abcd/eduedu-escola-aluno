FROM node:18 AS builder
WORKDIR /app

ARG API_URL
ARG ADMIN_URL
ARG BUILD_MODE=production

ENV VITE_API_URL=${API_URL}
ENV VITE_ADMIN_URL=${ADMIN_URL}
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY . .

RUN npm install --legacy-peer-deps
RUN npx vite build --mode $BUILD_MODE

FROM nginx:1.16.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./.nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]

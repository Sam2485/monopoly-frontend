FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:alpine
ENV PORT=8080

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/30-env-js.sh /docker-entrypoint.d/30-env-js.sh
RUN chmod +x /docker-entrypoint.d/30-env-js.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

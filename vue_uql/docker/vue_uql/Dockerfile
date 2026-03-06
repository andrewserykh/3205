FROM node:23-bookworm-slim AS build

ARG NAME
WORKDIR /app

COPY ${NAME}/package*.json ./
RUN npm ci

COPY ${NAME}/src ./src
COPY ${NAME}/public ./public
COPY ${NAME}/index.html ./
COPY ${NAME}/vite.config.ts ./
COPY ${NAME}/tsconfig*.json ./

RUN npm run build

FROM nginx:1.27-alpine AS production

ARG NAME

RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
COPY ${NAME}/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ${NAME}/nginx/conf.d /etc/nginx/conf.d


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
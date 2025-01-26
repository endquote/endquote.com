FROM nginx:alpine
RUN apk add --no-cache apache2-utils
COPY nginx.conf /etc/nginx/nginx.conf

ARG NGINX_BASIC_AUTH_USER
ARG NGINX_BASIC_AUTH_PASSWORD

RUN echo -n "${NGINX_BASIC_AUTH_USER}:" >> /etc/nginx/.htpasswd && \
    echo $(openssl passwd -apr1 ${NGINX_BASIC_AUTH_PASSWORD}) >> /etc/nginx/.htpasswd

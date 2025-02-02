FROM nginx:alpine
RUN apk add --no-cache apache2-utils openssl
COPY nginx.conf /etc/nginx/nginx.conf

ARG DATA_BASIC_AUTH_USER
ARG DATA_BASIC_AUTH_PASS

RUN echo -n "${DATA_BASIC_AUTH_USER}:" >> /etc/nginx/.htpasswd && \
    openssl passwd -apr1 "${DATA_BASIC_AUTH_PASS}" >> /etc/nginx/.htpasswd

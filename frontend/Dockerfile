FROM node:19-alpine

COPY ./scripts/entrypoint.sh /usr/bin/entrypoint.sh

RUN mkdir -p /usr/src/app && \ 
    chmod -R 777 /usr/src/app && \
    chmod +x /usr/bin/entrypoint.sh

WORKDIR /usr/src/app

COPY package*.json ./

ENTRYPOINT ["entrypoint.sh"]
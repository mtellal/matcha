FROM node:19-alpine

RUN mkdir -p /usr/src/app

RUN chmod -R 777 /usr/src/app

COPY ./scripts/entrypoint.sh /usr/bin/entrypoint.sh

RUN chmod +x /usr/bin/entrypoint.sh

COPY ./package*.json /usr/bin/app/

WORKDIR /usr/src/app

ENTRYPOINT ["entrypoint.sh"]
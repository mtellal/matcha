FROM nginx

COPY ./scripts/entrypoint.sh /bin/entrypoint.sh

RUN chmod +x /bin/entrypoint.sh

COPY matcha_development.conf /etc/nginx/conf.d/matcha_development.conf

COPY matcha_production.conf /etc/nginx/conf.d/matcha_production.conf

COPY fullchain.pem /etc/letsencrypt/live/matcha.mezyann.fr/fullchain.pem

COPY privkey.pem /etc/letsencrypt/live/matcha.mezyann.fr/privkey.pem

ENTRYPOINT ["/bin/entrypoint.sh"]
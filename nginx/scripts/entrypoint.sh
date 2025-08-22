#!/bin/bash

if [[ $ENV == "production" ]]; then 
    echo "---- NGINX PRODUCTION MODE ----"
    rm /etc/nginx/conf.d/matcha_development.conf
else
    echo "---- NGINX DEVELOPMENT MODE ----"
    rm /etc/nginx/conf.d/matcha_production.conf
fi


nginx -g 'daemon off;'
FROM mariadb

COPY    ./sql /docker-entrypoint-initdb.d/
RUN     chmod 777 -R /docker-entrypoint-initdb.d/

CMD ["mariadbd"]

FROM mysql:8

ARG db_user=inclutec-db-admin
ARG db_pwd=inclutecDevAdmin
ARG db_root_pwd=inclutec-mysql

# needed for intialization
ENV MYSQL_ROOT_PASSWORD=$db_root_pwd

RUN echo "CREATE USER '$db_user'@'%' identified with mysql_native_password by '$db_pwd'; GRANT ALL PRIVILEGES ON *.* TO '$db_user'@'%'; FLUSH PRIVILEGES;" > /docker-entrypoint-initdb.d/0-mysql-setup.sql

COPY ./sql/ /docker-entrypoint-initdb.d/

FROM mongo:3.6

ARG db_user=mongo
ARG db_pwd=mongo
ARG db_name=mongo

ENV MONGO_INITDB_DATABASE=$db_name

COPY ./2-initial-populate.js /docker-entrypoint-initdb.d/

RUN echo "db.createUser({user: \"$db_user\", pwd: \"$db_pwd\", roles:[{role: \"dbOwner\", db: \"$MONGO_INITDB_DATABASE\"}]});" > /docker-entrypoint-initdb.d/1-mongo-setup.js

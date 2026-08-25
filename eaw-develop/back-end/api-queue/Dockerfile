FROM --platform=linux/amd64 eaw-api-loopback:latest

WORKDIR /eaw-api
COPY ./ ./
RUN mv 'server/datasources.local-deploy.js' 'server/datasources.local.js' &&\
  npm install


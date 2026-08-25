FROM ubuntu:bionic

WORKDIR /eaw-api

RUN apt-get update &&\
  apt-get -y install curl &&\
  curl -sL https://deb.nodesource.com/setup_8.x | bash - &&\
  apt install nodejs -y - &&\
  npm install -g forever

RUN apt-get update
RUN apt-get install font-manager -y
COPY fonts ./fonts
RUN mv ./fonts/* /usr/local/share/fonts &&\
  fc-cache -fv

RUN apt update && apt install git -y

RUN npm install puppeteer@1.19.0 &&\
  apt-get -y update &&\
  apt-get -y install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN ln -snf /usr/share/zoneinfo/Etc/UTC /etc/localtime &&\
  echo "Etc/UTC" > /etc/timezone &&\
  apt-get install texlive-full -y &&\
  rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install software-properties-common -y &&\
  apt-add-repository universe &&\
  apt-get update &&\
  apt-get install python-pip -y  &&\
  pip install Pygments

COPY ./entrypoint.sh ./
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

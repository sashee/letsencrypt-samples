FROM ubuntu:17.10

RUN apt-get update

RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:certbot/certbot
RUN apt-get update
RUN apt-get install -y certbot

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD app/package.json app/package-lock.json /app/
WORKDIR /app
RUN npm install

ADD app/ /app/

ADD scripts/run.sh /run.sh
ADD scripts/renew.sh /renew.sh
RUN chmod +x /run.sh
RUN chmod +x /renew.sh

EXPOSE 443
EXPOSE 80

CMD ["/usr/bin/supervisord"]
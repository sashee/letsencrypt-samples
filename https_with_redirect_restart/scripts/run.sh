#!/bin/bash

IP=$(curl ifconfig.co)
certbot certonly --standalone --register-unsafely-without-email --agree-tos --staging -d $IP.nip.io --deploy-hook "supervisorctl start node && supervisorctl start letsencrypt-renew"
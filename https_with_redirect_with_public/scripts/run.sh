#!/bin/bash

IP=$(curl ifconfig.co)
certbot certonly --webroot --register-unsafely-without-email --agree-tos --staging -w /app/public -d $IP.nip.io --deploy-hook "supervisorctl restart node && supervisorctl start letsencrypt-renew"
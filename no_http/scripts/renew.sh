sleep 15s

certbot renew --force-renewal --deploy-hook="supervisorctl restart node"
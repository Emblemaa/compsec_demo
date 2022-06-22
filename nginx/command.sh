#!/bin/bash

certDir="."

if [ ! -f "$certDir/nginx.key" ]; then
    mkdir -p $certDir
    openssl genrsa 2048 > "$certDir/nginx.key"
    openssl req -new -x509 -nodes -days 365 -subj "/C=VN/ST=HCM/L=HCM City/O=Compsec Demo Nginx/OU=APCS/CN=Group 7" -key "$certDir/nginx.key" -out "$certDir/nginx.crt"
    chmod 700 "$certDir/nginx.key"
    chmod 700 "$certDir/nginx.crt"
fi

nginx -g "daemon off;"
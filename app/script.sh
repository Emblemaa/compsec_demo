#!/bin/bash

rootDir="../certs"
serverDir="$rootDir/server"
clientDir="$rootDir/client"
invalidDir="$rootDir/invalid"

if [ ! -f "$rootDir/root.key" ]; then
    mkdir -p $rootDir
    openssl genrsa 2048 > "$rootDir/root.key"
    openssl req -new -x509 -nodes -days 365 -subj "/C=VN/ST=HCM/L=HCM City/O=Compsec Demo/OU=APCS/CN=Group 7" -key "$rootDir/root.key" -out "$rootDir/root.crt"
    
    mkdir -p $serverDir
    openssl req -newkey rsa:2048 -nodes -days 365000 -keyout "$serverDir/server.key" -out "$serverDir/server.req" -subj "/C=VN/ST=HCM/L=HCM City/O=Compsec Demo Server/OU=APCS/CN=Group 7"
    openssl x509 -req -days 365000 -set_serial 01 -in "$serverDir/server.req" -out "$serverDir/server.crt" -CA "$rootDir/root.crt" -CAkey "$rootDir/root.key"
    unlink "$serverDir/server.req"
    openssl verify -CAfile "$rootDir/root.crt" "$serverDir/server.crt"

    mkdir -p $clientDir
    openssl req -newkey rsa:2048 -nodes -days 365000 -keyout "$clientDir/client.key" -out "$clientDir/client.req" -subj "/C=VN/ST=HCM/L=HCM City/O=Compsec Demo Client/OU=APCS/CN=Group 7"
    openssl x509 -req -days 365000 -set_serial 01 -in "$clientDir/client.req" -out "$clientDir/client.crt" -CA "$rootDir/root.crt" -CAkey "$rootDir/root.key"
    unlink "$clientDir/client.req"
    openssl verify -CAfile "$rootDir/root.crt" "$clientDir/client.crt"

    mkdir -p $invalidDir
    openssl genrsa 2048 > "$invalidDir/invalid.key"
    openssl req -new -x509 -nodes -days 365 -key "$invalidDir/invalid.key" -out "$invalidDir/invalid.crt" -subj "/C=VN/ST=HCM/L=HCM City/O=Compsec Demo Invalid/OU=APCS/CN=Group 7" 
fi

jwtDir="../jwt_keys"

if [ ! -f "$jwtDir/rsa.private" ]; then
    mkdir -p $jwtDir
    openssl genrsa -out "$jwtDir/rsa.private" 2048
    openssl rsa -in "$jwtDir/rsa.private" -out "$jwtDir/rsa.public" -pubout -outform PEM
fi

node server.js &
node client.js &
node unauth_client.js &
wait -f
sudo pkill node 
exit $!

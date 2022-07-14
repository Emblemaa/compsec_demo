# Computer Security Demo

## Members

- 19125096 - Vũ Đức Huy
- 19125083 - Thái Ngọc Thành Đạt
- 19125100 - Tạ Ngọc Minh Khoa
- 19125104 - Phạm Thiên Long

## Introduction

- mTLS is used for verification between a server and its clients. Certificates and keys are generated and stored in `./certs` directory, with the certificates and keys of the server, an authorized and unauthorized client being stored in the respective directories.
- gRPC is used for the server to provide services to its clients. Models and services are defined in `./app/users.proto`.
- After logging in using `/login` endpoint, a JWT whose signature is encrypted using RS256 algorithm is returned for user verification when using `/profile` endpoint. The private and public keys responsible for encrypting and decrypting the JWT's signature are stored in `./jwt_keys` directory.
- Nginx is used as a reverse proxy with SSL enabled. Nginx' certificate and key are stored in `./nginx`.

## Prerequisites

- `docker.io` installed
- `docker-compose` installed

## Running the project

- Start docker daemon
> sudo dockerd 

- Build images
> sudo docker-compose build

- Build & run containers
> sudo docker-compose run

After containers are built, the services are now served with https on port 443 of localhost.

## Available endpoints

- /login
> curl --location --request POST 'https://localhost/login' \\\
--header 'Content-Type: application/json' \\\
--data-raw '{
    "username": "\<username\>",
    "password": "\<password\>"
}' -k
- /profile
> curl --location --request GET 'https://localhost/profile' \\\
> --header 'Authorization: \<token\>' -k
- Test mTLS unauth client
> curl --location --req GET 'http://localhost/'

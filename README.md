# Computer Security Demo 

## Members
- 19125096 - Vũ Đức Huy
- 19125083 - Thái Ngọc Thành Đạt
- 19125100 - Tạ Ngọc Minh Khoa
- 19125104 - Phạm Thiên Long

## Introduction
- mTLS is used for verification between a server and its clients. Certificates and keys are generated and stored in ```./certs``` directory, with the certificates and keys of the server, an authorized and unauthorized client being stored in the respective directories.
- gRPC is used for the server to provide services to its clients. Models and services are defined in ```users.proto```.
- After logging in using ```/login``` endpoint, a JWT whose signature is encrypted using RS256 algorithm is returned for user verification when using ```/profile``` endpoint. The private and public keys responsible for encrypting and decrypting the JWT's signature are stored in ```./jwt_keys``` directory.
## Prerequisite
docker-compose installed

## Running the project
> sudo docker-compose up

After containers are built, the services are now served on port 80 of localhost.

## Available endpoints
- /login
> curl --location --request POST 'localhost/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username" : "19125096",
    "password" : "123"
}'
- /profile
> curl --location --request GET 'localhost/profile' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE5MTI1MDk2IiwiaWF0IjoxNjU1ODAwMDcwLCJleHAiOjE2NTU4MjAwNzB9.QYTpvcBte-Xs7WaCpv7TFbRD-0_JX77F543wnsCigjiFUGGxD7M61gN0uY1K0Xgjx4IBek8c0CU1XNdjtsLAG4wiWzxhQNe9ANvuXxcRrlqip2ge8xGoPgQgfbNE7XLTo9_1R2cNhibdPT8zEv92_cCxam7YPryIv8zrJthqwRydkEwvS5aiSSGwyhDh7QzTj3eim3ezOypwTcTc6grrIIHNFlfS67ZkVsnuoJpvnswYp_XOMD3YTTatnm8dbRuX9HzMOr6EThsgZqvEyMSh9Fh3cFozY0R0kwFcfcWPlNNAJuME1qxpY2s2abpTKptxIubWEmmzbZHak4hJ_J5mdA'

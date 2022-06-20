# Computer Security Demo 

## Members
- 19125096 - Vũ Đức Huy
- 19125083 - Thái Ngọc Thành Đạt
- 19125100 - Tạ Ngọc Minh Khoa
- 19125104 - Phạm Thiên Long

## Introduction
- mTLS is used for verification between a server and its clients. Certificates and keys are generated and stored in ```./certs``` directory, with the certificates and keys of the server, an authorized and unauthorized client being stored in the respective directories.
- gRPC is used for the server to provide services to its clients. Models and services are defined in ```users.proto```.
- After logging in using ```/login``` endpoint, a JWT whose signature is encrypted using RS256 algorithm is returned for user verification when using ```/profile``` endpoint. The private and public keys responsible for encrypting and decrypting the JWT's signature are stored in ```./jwt_keys``` directory
## Before running the project
Open cmd in the project directory and run  
> ```bash script.sh``` 

to generate certificates and keys for the server and its client, and JWT's private and public keys
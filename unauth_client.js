const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const express = require("express");
const fs = require("fs");

const PROTO_PATH = "users.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const userProto = grpc.loadPackageDefinition(packageDefinition);

const app = express();

app.get("/", (req, res) => {
  const client = new userProto.UserService(
    "localhost:50051",
    // grpc.credentials.createInsecure()
    grpc.credentials.createSsl(
      fs.readFileSync("./certs/root.crt"),
      fs.readFileSync("./certs/invalid/invalid.key"),
      fs.readFileSync("./certs/invalid/invalid.crt"),
      {
        checkServerIdentity: (hostname, cert) => {},
      }
    )
  );
  client.getAllUsers({}, (error, response) => {
    if (error) {
      console.error(error);
      return res.status(500).json(error);
    }
    return res.status(200).json({ status: "Ok", value: response.users });
  });
});

app.listen(3001, "localhost", () => {
  console.log("Listening for request");
});

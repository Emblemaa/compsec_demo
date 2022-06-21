const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const fs = require("fs");
const User = require("./user.model");
const PROTO_PATH = "users.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const diceProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const users = [
  new User("19125096", "123", "Vũ Đức Huy", 21, "vdhuy19@apcs.vn"),
  new User("19125083", "123", "Thái Ngọc Thành Đạt", 21, "tntdat19@apcs.vn"),
  new User("19125100", "123", "Tạ Ngọc Minh Khoa", 21, "tnmkhoa19@apcs.vn"),
  new User("19125104", "123", "Phạm Thiên Long", 21, "ptlong19@apcs.vn"),
];

server.addService(diceProto.UserService.service, {
  getAllUsers: (_, callback) => {
    callback(null, { users: users });
  },
  getUserByUsername: (call, callback) => {
    for (user of users) {
      if (user.username == call.request.username) {
        delete user.password;
        return callback(null, user);
      }
    }
    callback(
      {
        status: "Not found",
        message: "Username " + call.request.username + " not found",
      },
      null
    );
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  //   grpc.ServerCredentials.createInsecure(),
  grpc.ServerCredentials.createSsl(
    fs.readFileSync("../certs/root.crt"),
    [
      {
        private_key: fs.readFileSync("../certs/server/server.key"),
        cert_chain: fs.readFileSync("../certs/server/server.crt"),
      },
    ],
    true
  ),
  (error, port) => {
    console.log("Server running at localhost:" + port);
    server.start();
  }
);

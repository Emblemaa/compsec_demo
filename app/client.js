const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const express = require("express");
const jwt = require("jsonwebtoken");
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

app.use(express.json());

const client = new userProto.UserService(
  "0.0.0.0:50051",
  grpc.credentials.createSsl(
    fs.readFileSync("../certs/root.crt"),
    fs.readFileSync("../certs/client/client.key"),
    fs.readFileSync("../certs/client/client.crt"),
    {
      checkServerIdentity: (hostname, cert) => {
        console.log(cert);
      },
    }
  )
);

const auth = (req, res, next) => {
  var token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  if (token.split(" ")[0] === "Bearer") token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      fs.readFileSync("../jwt_keys/rsa.public")
    );
    req.user = decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: "Unauthorized", message: "JWT expired" });
    }
    return res.status(401).send(err);
  }
  return next();
};

app.get("/profile", auth, (req, res) => {
  client.getUserByUsername(req.user, (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    delete response.password;
    return res.status(200).json({ status: "Ok", user: response });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  client.getAllUsers({}, (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    for (user of response.users) {
      if (username === user.username) {
        if (password === user.password) {
          return res.status(200).json({
            status: "Ok",
            token: jwt.sign(
              { username: username },
              fs.readFileSync("../jwt_keys/rsa.private"),
              { algorithm: "RS256", expiresIn: 20000 }
            ),
          });
        }
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid credentials for username " + username,
        });
      }
    }
  });
});

app.get("/", (_, res) => {
  return res.status(200).send("Compsec demo server");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Listening for request at 3000");
});

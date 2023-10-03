var express = require("express");
var app = express();
var { expressjwt: jwt } = require("express-jwt");
var jwks = require("jwks-rsa");
var https = require("https");
var path = require("path");
var fs = require("fs");
var cors = require("cors");
var DBConnection = require("./db/DBConnection");
require("dotenv").config();

const workerRoutes = require("./routes/worker_routes");
const managerRoutes = require("./routes/manager_routes");
const messageRoutes = require("./routes/message_routes");
const fileRoutes = require("./routes/file_routes");
var port = process.env.PORT || 8080;

DBConnection();

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }),
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  algorithms: [process.env.ALGO],
});

app.use(cors());
app.use(express.json());

app.use(jwtCheck);

app.use("/workers", workerRoutes);
app.use("/managers", managerRoutes);
app.use("/messages", messageRoutes);
app.use("/file", fileRoutes);
app.use("/", (req, res) => {
  res.status(200).json({ it: "works" });
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "certs", "pkey.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
  },
  app
);

sslServer.listen(port, () =>
  console.log(`Secure server listening on port ${port}`)
);

console.log(jwtCheck)

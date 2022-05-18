const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const uifolder = __dirname + "/ui/";

app.use("/",express.static(uifolder));

server.listen(port, () => {
  console.log(`UI at http://localhost:${port}`);
});
module.exports = io;
const express = require("express");
const app = express();
const port = 6060;
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const io = new Server(httpServer,{
    wsEngine: require("eiows").Server,
    cors: {
        // origin: "https://xembong365.com",
        origin: "http://localhost:3000",
    }
});
// socket.io
io.on("connection", (socket) => {
  socket.on("client-send-data", (data) => {
    io.sockets.emit("sever-send-data", data);
  });
  socket.on("disconnect", () => {});
});
httpServer.listen(port, () => {
  console.log(`socket IO is listening ${port}`);
});

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const Server  = require('socket.io');
const path = require('path');

const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("A new user connected");

    socket.on("send-location", (data) => {
        // console.log("Location data received from client:", data);
        io.emit("received-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
        io.emit("user-disconnected", { id: socket.id });
    });
});

app.get('/', (req, res) => {
    res.render('index');
});
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("Server Running on port 3000");
});

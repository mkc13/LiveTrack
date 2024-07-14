if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io'); 
const app = express();
const server = http.createServer(app);
const io = socketIo(server); 

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("A new user connected");

    socket.on("send-location", (data) => {
        io.emit("received-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", { id: socket.id });
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});

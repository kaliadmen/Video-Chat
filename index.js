const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running.")
});

io.on('connection', (socket) => {
    socket.emit('me',socket.id);

    socket.on('call_user', ({ userToCall, signalData, from, name}) => {
        io.to(userToCall).emit('call_user', {signal: signalData, from, name});
    });

    socket.on('call_answered', (data) => {
        io.to(data.to).emit('call_accepted', data.signal);
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('call_ended');
    })
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
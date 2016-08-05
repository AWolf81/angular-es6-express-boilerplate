// index.js

let curSocket;
let activeSockets = {};
let nameCounter  = 1;

export default function(io) {
    // [
    //  { session_id: "5W5f-HSzolBOjMj7AAAC", name: "Peter" },
    //  { session_id: "YXlbm_LmHD7oUGwkAAAD", name: "Martin"}
    // ]

    io.on("connection", function(socket) {

        // socket.send(socket.id);
        // io.sockets.emit('news', { hello: 'world'});
        socket.emit('news', { hello: 'world'});

        socket.on("new_user", function(data) {

            var newName = "Guest " + nameCounter++;
            // participants.push({ id: data.id, name: newName });

            activeSockets[data.id] = {
                    name: newName,
                    io: socket
            };

            socket.emit("new_connection", {
                  user: {
                        id: data.id,
                        name: newName
                  },
                  sender:"system",
                  created_at: new Date().toISOString(),
                  //participants: participants
            });
            
        });
    });

    // save socket data for later usage
    curSocket = io;

    return io;
}

export {activeSockets, curSocket};
module.exports =  (io) => {
    io.on("connection", (socket) => {
      console.log("New client connected");
  
      socket.on("joinRoom", ({ userId }) => {
        console.log(`User ${userId} joined`);
        socket.join(userId);
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

    });
  };
  
// import ACTIONS from './Actions.js'

// const userSocketMap = {};
// const emailToSocketIdMap = new Map();
// const socketidToEmailMap = new Map();
// const VideoCallHandler = (io) => {
//     io.on('connection', (socket)=>{
//       console.log('user connected to video call socket',socket.id)
//         async function getAllConnectedClients (socket, roomId) {
//             // Map
//             const sockets = await io.in(roomId).fetchSockets();
//             // console.log('socket',sockets);
//             const socketDetails = sockets.map(s => {
//                 return {socketId : s.id, username : userSocketMap[s.id]};
//             })
//             return socketDetails;
//         }
    
    
    
//         socket.on(ACTIONS.JOIN, async({ roomId, username }) => {
//             userSocketMap[socket.id] = username;
//             socket.join(roomId);
//             const clients = await getAllConnectedClients(socket, roomId);
//             clients?.forEach(({ socketId }) => {
//                 io.to(socketId).emit(ACTIONS.JOINED, {
//                     clients,
//                     username,
//                     socketId: socket.id,
//                 });
//             });
//         });


//         socket.on("room:join", (data) => {
//             const { roomId, username } = data;
//             roomIdToSocketIdMap.set(roomId, socket.id);
//             socketidToroomIdMap.set(socket.id, roomId);
//             io.to(room).emit("user:joined", { roomId, username: socket.id });
//             socket.join(room);
//             io.to(socket.id).emit("room:join", data);
//           });
        
//           socket.on("user:call", ({ to, offer }) => {
//             io.to(to).emit("incomming:call", { from: socket.id, offer });
//           });
        
//           socket.on("call:accepted", ({ to, ans }) => {
//             io.to(to).emit("call:accepted", { from: socket.id, ans });
//           });
        
//           socket.on("peer:nego:needed", ({ to, offer }) => {
//             console.log("peer:nego:needed", offer);
//             io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
//           });
        
//           socket.on("peer:nego:done", ({ to, ans }) => {
//             console.log("peer:nego:done", ans);
//             io.to(to).emit("peer:nego:final", { from: socket.id, ans });
//           });
    
      
    
//         socket.on('disconnecting', () => {
//             const rooms = [...socket.rooms];
//             rooms.forEach((roomId) => {
//                 socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                     socketId: socket.id,
//                     username: userSocketMap[socket.id],
//                 });
//             });
//             delete userSocketMap[socket.id];
//             socket.leave();
//         });
    
//     })
// }
// export default VideoCallHandler;
import ACTIONS from './Actions.js'

const userSocketMap = {};
const CollabCodeHandler = (io) => {
    io.on('connection', (socket)=>{
        async function getAllConnectedClients (socket, roomId) {
            // Map
            const sockets = await io.in(roomId).fetchSockets();
            // console.log('socket',sockets);
            const socketDetails = sockets.map(s => {
                return {socketId : s.id, username : userSocketMap[s.id]};
            })
            return socketDetails;
        }
    
    
    
        socket.on(ACTIONS.JOIN, async({ roomId, username }) => {
            userSocketMap[socket.id] = username;
            socket.join(roomId);
            const clients = await getAllConnectedClients(socket, roomId);
            clients?.forEach(({ socketId }) => {
                io.to(socketId).emit(ACTIONS.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                });
            });
        });
    
        socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
            socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
        });
    
        socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
            io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
        });
    
        socket.on('disconnecting', () => {
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) => {
                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                });
            });
            delete userSocketMap[socket.id];
            socket.leave();
        });
    
    })
}
export default CollabCodeHandler;
import { io } from 'socket.io-client'

var url = "http://localhost:3000/"

export default io(url, { transports: ['websocket'], reconnection: true })
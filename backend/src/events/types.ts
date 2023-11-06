import { Socket } from "socket.io"

export type MatchaSocket = {
    userId: number,
    socket: Socket
}

export type Message = {
    convId: number, 
    authorId: number, 
    userId: number, 
    text: string
}

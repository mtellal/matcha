import { Socket } from "socket.io";
import { MatchaSocket } from "./types";

export class SocketIds {

    socketIds: MatchaSocket[] = [];

    getSocketIds() {
        return (this.socketIds)
    }

    addSocketId = (socket: Socket) => {
        let data: MatchaSocket | undefined;
        if (!this.socketIds.length || !(data = this.socketIds.find((o: MatchaSocket) => Number(o.userId) === Number(socket.data.token.id)))) {
            this.socketIds.push({ userId: socket.data.token.id, socket })
        }
        else if (data) {
            data.socket.disconnect();
            this.socketIds = this.socketIds.map((o: MatchaSocket) => o.userId === socket.data.token.id ? ({ ...o, socket }) : o)
        }
    }

    deleteSocketId = (userId: number | string) => {
        this.socketIds = this.getSocketIds().filter((o: MatchaSocket) => Number(o.userId) !== Number(userId))
    }
}

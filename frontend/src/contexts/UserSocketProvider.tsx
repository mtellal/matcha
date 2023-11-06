import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNotificationContext } from "./NotificationsProvider";
import { useLikesContext } from "./LikesProvider";
import { useChatContext } from "./ChatProvider";
import { Conversation, Message, Notification } from "../types";
import { useLocation } from "react-router";
import { useCurrentUser } from "./UserContext";
import { apiURL } from "../requests";

export const UserSocketContext = createContext(null);

export function useUserSocket() {
    return (useContext(UserSocketContext))
}

export default function UserSocketProvider({ children }: { children: ReactNode }) {

    const { currentUser, addBlockUserId, removeBlockUserId } = useCurrentUser();
    const location = useLocation();
    const { addUserLike, removeUserLike } = useLikesContext();
    const { addConversation, deleteConversation, addMessage } = useChatContext();
    const { setNotifications, setNewNotif, setNewNotifChat, notifications } = useNotificationContext();
    const [userSocket, setUserSocket] = useState(null);


    useEffect(() => {
        const socket = io(`${apiURL}/user`, {
            transports: ['websocket'],
            withCredentials: true,
        })

        socket.on('connect', () => {
            setUserSocket(socket)

        })

        return () => {
            if (socket)
                socket.disconnect();
        }
    }, [])

    const recievedNotif = async (notification: Notification) => {
        setNotifications((t: Notification[]) => {

            let newTabNotifs: Notification[] = t;
            if (t && !t.length) {
                return ([notification])
            }
            else if (!t.find((n: Notification) => n.id === notification.id))
                newTabNotifs = [...t, notification];
            else if (t) {
                newTabNotifs = t.map((n: Notification) => {
                    if (Number(n.id) === Number(notification.id) && notification.createdAt) {
                        let newNotif = { ...n, createdAt: notification.createdAt };
                        if (!n.convId && notification.action === "match" && notification.convId)
                            newNotif = { ...newNotif, convId: notification.convId }
                        return (newNotif)
                    }
                    return (n)
                })
            }
            if (t && t.length)
                return (
                    newTabNotifs
                        .sort((a: Notification, b: Notification) =>
                            new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1)
                )
            return (t)
        })
    }

    useEffect(() => {
        if (userSocket && userSocket.connected) {

            userSocket.on("notification", async (notification: Notification) => {
                // console.log("recieved notification event ", notification)
                if (notification) {
                    if ((notification.action === "message" || notification.action === "match") &&
                        notification.convId && location.pathname === `/chat/${notification.convId}`)
                        return;
                    else if (notification.action === "message" && notification.convId &&
                        location.pathname !== `/chat/${notification.convId}`)
                        setNewNotifChat(true);
                    recievedNotif(notification)
                    setNewNotif((n: number) => n + 1)
                }
            })

            userSocket.on('like', async (userId: number) => {
                // console.log("recieved like event ", userId)
                if (userId) {
                    addUserLike(userId, true)
                }
            })

            userSocket.on('unlike', async (userId: number) => {
                // console.log("recieved unlike event ", userId)
                if (userId) {
                    removeUserLike(userId)
                }
            })

            userSocket.on('addConversation', async (conversation: Conversation) => {
                // console.log("addConversation event called ")
                if (conversation && conversation.id) {
                    addConversation(conversation)
                    if (location.pathname !== "/chat")
                        setNewNotifChat(true);
                }
            })

            userSocket.on('deleteConversation', async (conversation: Conversation) => {
                // console.log("deleteConversation event called ")
                if (conversation && conversation.id) {
                    if (notifications && notifications.length) {
                        setNotifications((t: Notification[]) => t.map((n: Notification) => {
                            if (n.action === "match" && n.convId === conversation.id) {
                                return ({ ...n, convId: null })
                            }
                            return (n)
                        }))
                    }
                    deleteConversation(conversation.id)
                }
            })

            userSocket.on('message', (message: Message) => {
                if (message) {
                    // console.log("receive message => ", message)
                    addMessage(message)
                }
            })


            userSocket.on('block', (blockUserId: number) => {
                if (blockUserId) {
                    // console.log("receive block event => ", blockUserId);
                    addBlockUserId(blockUserId);
                }
            })

            userSocket.on('unblock', (blockUserId: number) => {
                if (blockUserId) {
                    // console.log("receive block event => ", blockUserId);
                    removeBlockUserId(blockUserId);
                }
            })

            return () => {
                userSocket.removeAllListeners();
            }
        }
    }, [userSocket, location, currentUser, notifications])

    return (
        <UserSocketContext.Provider
            value={{
                userSocket,
            }}
        >
            {children}
        </UserSocketContext.Provider>
    )
}
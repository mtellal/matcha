import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { getUserNotifsRequest } from "../requests";
import { useCurrentUser } from "./UserContext";
import { Notification } from "../types";

type NotificationsContextType = {
    notifications: Notification[],
    setNotifications: (n: Notification[] | ((n: Notification[]) => Notification[])) => void,
    newNotif: number,
    setNewNotif: (b: number | ((b: number) => number)) => void,
    newNotifChat: boolean,
    setNewNotifChat: (b: boolean) => void,
}

export const NotificationsContext = createContext<NotificationsContextType>(null);

export function useNotificationContext() {
    return (useContext(NotificationsContext))
}

export default function NotificationsProvider({ children }: { children: ReactNode }) {

    const { currentUser } = useCurrentUser();
    const [notifications, setNotifications] = useState([]);
    const [newNotif, setNewNotif] = useState(0);
    const [newNotifChat, setNewNotifChat] = useState(false);

    const notificationsLoadedRef = useRef(false);

    useEffect(() => {
        if (currentUser && currentUser.notifications)
            setNewNotif(1);
    }, [currentUser])

    useEffect(() => {
        if (currentUser && notificationsLoadedRef && !notificationsLoadedRef.current)
            getUserNotifsRequest()
                .then(async res => {
                    notificationsLoadedRef.current = true;
                    if (res.data.notifications && res.data.notifications.length) {
                        setNotifications(res.data.notifications)
                    }
                })
                .catch(err => { })
    }, [currentUser, notificationsLoadedRef])

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                setNotifications,
                newNotif,
                setNewNotif,
                newNotifChat,
                setNewNotifChat,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    )
}
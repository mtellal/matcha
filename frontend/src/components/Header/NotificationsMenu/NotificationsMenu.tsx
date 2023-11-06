import { useLocation, useNavigate } from "react-router";
import { useCurrentUser } from "../../../contexts/UserContext";
import { useUserSocket } from "../../../contexts/UserSocketProvider";
import { useNotificationContext } from "../../../contexts/NotificationsProvider";
import { useCallback, useRef, useState } from "react";
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";
import { IconRef } from "../../Icons/Icon";

import bell from '../../../assets/Bell.svg';

import './NotificationsMenu.css'
import { Notification, User } from "../../../types";

export default function NotificationsMenu() {

    const location = useLocation();
    const navigate = useNavigate();
    const { setCurrentUser } = useCurrentUser();
    const { userSocket } = useUserSocket();
    const { notifications, newNotif, setNewNotif } = useNotificationContext();

    const [showNotifs, setShowNotifs] = useState(false);

    const menuRef: React.RefObject<HTMLDivElement> = useRef();
    const iconRef: React.RefObject<HTMLDivElement> = useRef();

    useOutsideComponent(menuRef, (e: MouseEvent) => {
        if (iconRef.current && !iconRef.current.contains(e.target as Node))
            setShowNotifs((p: boolean) => !p)
    })


    function onClick(notif: Notification) {
        setShowNotifs((p: boolean) => !p)
        if ((notif.action === "match" || notif.action === "message") && notif.convId) {
            if (location.pathname !== `/chat/${notif.convId}`)
                navigate(`/chat/${notif.convId}`)
        }
        else
            navigate(`/profile/${notif.userId}`)
    }

    const onClikcIcon = useCallback(() => {
        setShowNotifs((p: boolean) => !p)
        if (userSocket && setCurrentUser && setNewNotif) {
            setNewNotif(0);
            setCurrentUser((u: User) => u.notifications ? ({ ...u, notifications: 0 }) : u)
            userSocket.emit('removeNotifs')
        }
    }, [userSocket, setCurrentUser, setNewNotif, notifications])

    function determineAction(s: string) {
        if (s === "view")
            return ("viewed your profile")
        else if (s === "like")
            return ("liked your profile")
        else if (s === "match")
            return ("matched your profile")
        else if (s === "unlike")
            return ("unliked your profile")
        else if (s === "message")
            return ("sent a message")
    }

    return (
        <div style={{ position: 'relative' }}>
            <IconRef
                className="headermenu-bell"
                ref={iconRef}
                icon={bell}
                onClick={onClikcIcon}
                notif={newNotif}
            />
            {
                showNotifs &&
                <div ref={menuRef} className='header-notif-menu' >
                    {
                        notifications && notifications.length > 0 ?
                            notifications
                                .map((n: Notification) => {
                                    return (
                                        <p key={n.id} className='header-notif font-12' onClick={() => onClick(n)} >
                                            <span className='font-14'>
                                                {n.firstName}
                                            </span> {determineAction(n.action)}
                                        </p>
                                    )
                                })
                            :
                            <p className='font-14-second header-0notif' >0 notifications</p>
                    }
                </div>
            }
        </div>
    )
}
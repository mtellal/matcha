import { useNavigate } from "react-router";
import { useUserSocket } from "../../../../contexts/UserSocketProvider";
import { useChatContext } from "../../../../contexts/ChatProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../../../contexts/UserContext";
import { useOutsideComponent } from "../../../../hooks/useOutsideComponent";
import { Icon } from "../../../Icons/Icon";
import moreIcon from '../../../../assets/More_Vertical.svg'

import './ProfileMenuSettings.css'
import { Conversation, User } from "../../../../types";

export function ProfileMenuSettings(props: { user: User }) {

    const navigate = useNavigate();
    const { conversations } = useChatContext();
    const { userSocket } = useUserSocket();
    const { currentUser, addBlockUserId, removeBlockUserId } = useCurrentUser();

    const [picking, setPicking] = useState(false);
    const [convId, setConvId] = useState<number>();
    const [userBlocked, setUserBlocked] = useState(false);

    const menuRef = useRef(null);

    useOutsideComponent(menuRef, (e: MouseEvent) => { setPicking(false) })

    useEffect(() => {
        let conv = null;
        if (conversations && conversations.length && props.user &&
            (conv = conversations.find((c: Conversation) => c.memberId === props.user.userId))) {
            setConvId(conv.id)
        }
    }, [conversations, props.user])

    function handleMessage(convId: number = -1) {
        setPicking((p: boolean) => !p);
        if (convId === -1)
            navigate(`/chat/`)
        else
            navigate(`/chat/${convId}`)
    }

    const handleBlock = useCallback((userId: number) => {
        setPicking((p: boolean) => !p);
        if (userSocket && currentUser) {
            if (userBlocked) {
                removeBlockUserId(userId)
                userSocket.emit("unblock", userId);
            }
            else {
                addBlockUserId(userId)
                userSocket.emit("block", userId)
            }
        }
    }, [userSocket, currentUser, userBlocked])

    const handleReport = useCallback((userId: number) => {
        setPicking((p: boolean) => !p);
        if (userSocket) {
            userSocket.emit('reportUser', userId)
        }
    }, [userSocket])

    useEffect(() => {
        if (currentUser && props.user) {
            if (currentUser.blockIds && currentUser.blockIds.length &&
                currentUser.blockIds.find((id: number) => id === props.user.userId)) {
                setUserBlocked(true)
            }
            else
                setUserBlocked(false)
        }
    }, [currentUser, props.user])

    return (
        <div ref={menuRef} style={{ position: 'relative' }}>
            <Icon
                icon={moreIcon}
                onClick={() => setPicking((p: boolean) => !p)}
                style={{ height: '30px', width: '30px' }}
            />
            <div
                className="profilemenusettings-menu"
                style={picking ? { visibility: 'visible' } : { visibility: 'hidden' }}
            >
                <p style={{ border: 'none' }} onClick={() => handleBlock(props.user.userId)}>{userBlocked ? "unblock" : "block"}</p>
                {convId ? <p onClick={() => handleMessage(convId)}>message</p> : null}
                <p onClick={() => handleReport(props.user.userId)}>report</p>
            </div>
        </div>
    )
}

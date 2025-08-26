import { useCallback } from "react";

import UserLabel from "../../Label/UserLabel/UserLabel";

import './ChatMenu.css'
import { useChatContext } from "../../../contexts/ChatProvider";
import { useNavigate, useParams } from "react-router";
import { Conversation, Message } from "../../../types";
import { ProfilePicture } from "../../ProfilePicture/ProfilePicture";
import { useCurrentUser } from "../../../contexts/UserContext";

type ChatMenuProps = {
    onClick?: () => void
}

export default function ChatMenu(props: ChatMenuProps) {

    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser } = useCurrentUser()

    const { conversations } = useChatContext();

    function searchLastMessage(messages: Message[], userId: number, lastMessage: Message) {
        if (!messages || !messages.length) {
            if (lastMessage)
                return (lastMessage.text)
            return ('');
        }
        let _message = [...messages].reverse().find((m: Message) => Number(m.authorId) === Number(userId))
        return (_message ? _message.text : "")
    }

    const handleConv = useCallback((convId: number) => {
        if (parseInt(id) !== Number(convId))
            navigate(`/chat/${convId}`)
        if (props.onClick)
            props.onClick();
    }, [id, props, navigate])

    return (
        <div className='chatmenu'>
            <div className="chatmenu-title">
                <div style={{ position: 'relative', height: '100%' }}>
                    <div style={{ height: '10px', width: '10px', background: 'lightgreen', borderRadius: '5px', position: 'absolute', bottom: '5px', right: '5px' }}></div>
                    <ProfilePicture
                        url={currentUser && currentUser.photos && currentUser.photos[0] && currentUser.photos[0].url}
                        userId={currentUser.userId}
                        onClick={() => { }}
                        style={{ height: '60px', width: '60px', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0 15px',
                    gap: '5px',
                    color: 'white'
                }}>
                    <p style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: 0
                    }}>{currentUser.firstName} {currentUser.lastName}</p>
                    <p style={{
                        margin: '0',
                        fontSize: '14px'
                    }}>online</p>
                </div>
            </div>
            <div className='chatmenu-conversation-c'>
                <p style={{ margin: '0', width: '100%', color: 'white', fontWeight: '400', textAlign: 'start' }}>Messages</p>
                <div className='chatmenu-users'>
                    {
                        conversations.map((c: Conversation) => {
                            return (
                                <UserLabel
                                    key={c.id}
                                    user={c.user}
                                    message={searchLastMessage(c.messages, c.memberId, c.lastMessage)}
                                    onClick={() => handleConv(c.id)}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
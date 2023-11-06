import { useCallback } from "react";

import UserLabel from "../../Label/UserLabel/UserLabel";

import './ChatMenu.css'
import { useChatContext } from "../../../contexts/ChatProvider";
import { useNavigate, useParams } from "react-router";
import { Conversation, Message } from "../../../types";

type ChatMenuProps = {
    onClick?: () => void
}

export default function ChatMenu(props: ChatMenuProps) {

    const navigate = useNavigate();
    const { id } = useParams();

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
    }, [id, props.onClick])

    return (
        <div className='chatmenu'>
            <div className="chatmenu-title">
                <h1>Conversations</h1>
            </div>
            <div className='chatmenu-conversation-c'>
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
import './ChatPage.css'

import ChatMenu from '../../components/ChatPage/ChatMenu/ChatMenu';
import Banner from '../../components/ChatPage/Banner/Banner';

import Messenger from '../../components/ChatPage/Messenger/Messenger';
import { Outlet, useNavigate, useParams } from 'react-router';
import { useChatContext } from '../../contexts/ChatProvider';
import { useEffect, useState } from 'react';
import { useNotificationContext } from '../../contexts/NotificationsProvider';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Conversation, User } from '../../types';


export function ChatMessenger() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { setNewNotifChat } = useNotificationContext();
    const { conversations, conversationsLoadedRef } = useChatContext();

    const [user, setUser] = useState<User>();
    const [conversation, setConversation] = useState<Conversation>();

    useEffect(() => {
        if (conversations && conversationsLoadedRef.current) {
            if (conversations.length) {
                const conv = conversations.find((c: Conversation) => Number(c.id) === parseInt(id));
                if (conv) {
                    setConversation(conv)
                    setUser(conv.user)
                    setNewNotifChat(false)
                    return;
                }
            }
            navigate("/chat")
        }
    }, [conversations, conversationsLoadedRef, id])


    return (
        <div className='chatmessenger' style={{ flex: 7, height: '100%' }}>
            <Banner user={user} />
            <Messenger
                user={user}
                conversation={conversation}
            />
        </div>
    )
}

export type MobileChatContext = {
    setMenu: (p: boolean | ((p: boolean) => boolean)) => void
}

function MobileChat() {
    const [menu, setMenu] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        if (id)
            setMenu(false);
        else
            setMenu(true)
    }, [id])

    return (
        <>
            {
                menu ?
                    <ChatMenu onClick={() => setMenu((p: boolean) => !p)} />
                    :
                    <Outlet context={{ setMenu }} />
            }
        </>
    )
}


export default function Chat() {

    const { width } = useWindowDimensions();

    return (
        <div className='chat' >
            <div className='chat-c'>

                {
                    width <= 900 ?
                        <MobileChat />
                        :
                        <>
                            <ChatMenu />
                            <Outlet />
                        </>
                }
            </div>
        </div>
    )
}
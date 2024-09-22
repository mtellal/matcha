import { Outlet, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

import Banner from '../../components/ChatPage/Banner/Banner';

import Messenger from '../../components/ChatPage/Messenger/Messenger';
import { useChatContext } from '../../contexts/ChatProvider';
import { useNotificationContext } from '../../contexts/NotificationsProvider';
import { Conversation, User } from '../../types';


export default function ChatMessenger() {

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
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react"
import './Messenger.css'
import { useChatContext } from "../../../contexts/ChatProvider"
import paperPlane from '../../../assets/Paper_Plane.svg'
import { useUserSocket } from "../../../contexts/UserSocketProvider"
import { useCurrentUser } from "../../../contexts/UserContext"
import { Conversation, Message, User } from "../../../types"

type TMessage = {
    authorId: number,
    message: string,
    currentUserId: number
}

function MessageComponent(props: TMessage) {

    return (
        <div
            className="message"
            style={Number(props.authorId) === Number(props.currentUserId) ? { justifyContent: 'flex-end' } : {}}
        >
            <p
                className="message-text"
                style={Number(props.authorId) === Number(props.currentUserId) ? { backgroundColor: 'var(--purple3)', color: 'white' } : {}}
            >
                {props.message}
            </p>
        </div>
    )
}

function MessengerInput(props: { conversation: Conversation }) {

    const { userSocket } = useUserSocket()

    const [value, setValue] = useState("")

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value)
    }

    const sendMessage = useCallback(() => {
        if (userSocket && props.conversation && value && value.trim()) {
            userSocket.emit('message', {
                convId: props.conversation.id,
                authorId: props.conversation.userId,
                userId: props.conversation.memberId,
                text: value.trim(),
            })
            setValue("");
        }
    }, [userSocket, props.conversation, value, setValue])

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            // console.log("message send")
            sendMessage();
        }
    }

    return (
        <label htmlFor="msng-input" className="msng-input-c">
            <input
                id="msng-input"
                placeholder="Write your message ..."
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                maxLength={400}
            />
            <img
                className="msng-send-icon"
                src={paperPlane}
                onClick={() => sendMessage()}
                alt="Paper plane icon"
            />
        </label>
    )
}


type TMessenger = {
    user: User,
    conversation: Conversation
}

export default function Messenger({ conversation }: TMessenger) {

    const { currentUser } = useCurrentUser();
    const { loadConversationMessages } = useChatContext();

    const containerRef = useRef(null);
    const initScrollRef = useRef(false);

    useEffect(() => {
        if (conversation) {
            if (!conversation.messages) {
                loadConversationMessages(conversation.id)
            }
            else if (conversation.messages && containerRef.current) {
                if (!initScrollRef.current) {
                    containerRef.current.scrollTo({
                        top: containerRef.current.scrollHeight,
                        behavior: "smooth",
                    });
                    initScrollRef.current = true;
                }
                else {
                    if (containerRef.current.offsetHeight + containerRef.current.scrollTop >=
                        containerRef.current.scrollHeight * 0.8) {
                        containerRef.current.scrollTo({
                            top: containerRef.current.scrollHeight,
                            behavior: "smooth",
                        });
                    }
                    else {
                        containerRef.current.scrollTop = containerRef.current.scrollHeight;
                    }
                }
            }
        }
    }, [conversation, containerRef.current])

    return (
        <div ref={containerRef} className="messenger" >
            <div className="messenger-messages-c">
                {
                    conversation && conversation.messages &&
                        conversation.messages.length > 0 ?
                        conversation.messages.map((o: Message) =>
                            <MessageComponent
                                key={o.id}
                                authorId={o.authorId}
                                message={o.text}
                                currentUserId={currentUser.userId}
                            />
                        )
                        : <p className="font-14-second">No messages</p>
                }
            </div>
            <MessengerInput conversation={conversation} />
        </div>
    )
}
import { Dispatch, MutableRefObject, ReactNode, createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getConversationMessagesRequest, getLastMessageRequest, getUserConversationIdsRequest, getUserPhotoRequest, getUserRequest } from "../requests";
import { Conversation, Message } from "../types";


type ChatContextType = {
    conversations: Conversation[],
    dispatchConversations: Dispatch<Conversation[]>,
    loadConversationsDatas: (convs: Conversation[], addConv?: boolean) => void,
    addConversation: (conv: Conversation) => void,
    deleteConversation: (id: number) => void,
    loadConversationMessages: (convId: number) => void,
    addMessage: (m: Message) => void,
    conversationsLoadedRef: MutableRefObject<boolean>
}

export const ChatContext = createContext<ChatContextType>(null);


export function useChatContext() {
    return (useContext(ChatContext))
}


function convReducer(conversations: Conversation[], action: any) {
    switch (action.type) {

        case ('initConversationsIds'): {
            if (action.initConversationsIds)
                return (action.initConversationsIds)
        }
        case ('addConversation'): {
            if (action.conversation) {
                if (conversations.length && !conversations.find((c: Conversation) => c.id === action.conversation.id))
                    return ([...conversations, action.conversation])
                else
                    return ([action.conversation])
            }
        }
        case ('deleteConversation'): {
            if (action.convId && conversations.length)
                return (conversations.filter((c: Conversation) => c.id !== action.convId))
        }
        case ('addUser'): {
            if (action.user && action.convId) {
                return (
                    conversations.map((c: Conversation) => {
                        if (c.id === action.convId)
                            return ({ ...c, user: action.user })
                        return (c)
                    })
                )
            }
        }
        case ('addMessages'): {
            if (conversations.length && action.convId && action.messages) {
                return (
                    conversations.map((c: Conversation) => {
                        if (c.id === action.convId)
                            return ({ ...c, messages: action.messages })
                        return (c)
                    })
                )
            }
        }
        case ('addMessage'): {
            if (conversations.length && action.message && action.message.convId) {
                return (
                    conversations.map((c: Conversation) => {
                        if (c.id === action.message.convId) {
                            return ({ ...c, messages: c.messages && c.messages.length ? [...c.messages, action.message] : [action.message] })
                        }
                        return (c)
                    })
                )
            }
        }
        case ('updateLastMessage'): {
            if (conversations.length && action.message && action.message.convId) {
                return (
                    conversations.map((c: Conversation) => {
                        if (c.id === action.message.convId)
                            return ({ ...c, lastMessage: action.message })
                        return (c)
                    })
                )
            }
        }
        case ('addProfilePicture'): {
            if (action.photo && action.convId && conversations.length) {
                return (
                    conversations.map((o: Conversation) => {
                        if (o.id === action.convId) {
                            return ({ ...o, user: { ...o.user, photos: [{index: 0, url: action.photo}] } })
                        }
                        return (o)
                    })
                )
            }
        }
        default: return conversations
    }
}

export function ChatProvider({ children }: { children: ReactNode }) {

    const [conversations, dispatchConversations] = useReducer(convReducer, []);
    const conversationsLoadedRef = useRef(false);

    async function loadConversationMessages(convId: string | number) {
        getConversationMessagesRequest(convId)
            .then(res => {
                dispatchConversations({ type: 'addMessages', messages: res.data.messages, convId })
            })
            .catch(err => { })
    }

    async function loadConversationData(conv: Conversation, addConversation: boolean = false) {
        try {
            if (conv && conv.memberId) {
                try {
                    await getUserRequest(conv.memberId)
                        .then(res => {
                            if (addConversation)
                                dispatchConversations({ type: 'addConversation', conversation: conv })
                            dispatchConversations({ type: 'addUser', convId: conv.id, user: res.data.user })
                            getLastMessageRequest(conv.id, conv.memberId)
                                .then(res => {
                                    dispatchConversations({ type: 'updateLastMessage', message: res.data.message })
                                })
                                .catch(() => { })
                            if (res.data.user && parseInt(res.data.user.nbPhotos)) {
                                getUserPhotoRequest(0, Number(conv.memberId), 100)
                                    .then(res => {
                                        dispatchConversations({ type: 'addProfilePicture', convId: conv.id, photo: window.URL.createObjectURL(res.data) })
                                    })
                                    .catch(err => { })
                            }
                        })
                }
                catch (e) {
                    // console.log(e)
                }
            }
        }
        catch (e) {
            // console.log(e)
        }
    }

    async function loadConversationsDatas(convs: Conversation[], addConversation: boolean = null) {
        try {
            if (convs && convs.length) {
                for (let datas of convs) {
                    loadConversationData(datas)
                }
            }
        }
        catch (e) {
            // console.log(e)
        }
    }


    async function loadConvIds() {
        let _conversations;
        await getUserConversationIdsRequest()
            .then(res => {
                _conversations = res.data.conversations;
                dispatchConversations({ type: 'initConversationsIds', initConversationsIds: res.data.conversations })
            })
            .catch(err => { })
        await loadConversationsDatas(_conversations);
        conversationsLoadedRef.current = true;
    }

    useEffect(() => {
        loadConvIds()
    }, [])

    async function addConversation(conv: Conversation) {
        loadConversationData(conv, true)
    }

    async function deleteConversation(convId: number) {
        dispatchConversations({ type: 'deleteConversation', convId })
    }

    const addMessage = useCallback(async (message:Message) => {
        if (conversations && conversations.length) {
            const conv = conversations.find((c: Conversation) => c.id === message.convId);
            if (conv) {
                const _messages = conv.messages;
                if (!_messages || !_messages.length) {
                    await loadConversationMessages(conv.id);
                }
                dispatchConversations({ type: 'addMessage', message })
            }
        }
    }, [conversations])

    return (
        <ChatContext.Provider
            value={{
                conversations,
                dispatchConversations,
                loadConversationsDatas,
                addConversation,
                deleteConversation,
                loadConversationMessages,
                addMessage,
                conversationsLoadedRef
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}
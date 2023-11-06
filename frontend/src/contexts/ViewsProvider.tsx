import { MutableRefObject, ReactNode, createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getUserPhotoRequest, getUserRequest, getUserViews } from "../requests";
import { User } from "../types";
import { AxiosResponse } from "axios";


type ViewContextType = {
    userIdsRef: MutableRefObject<number[]>,
    viewUsers: User[],
    setViewUsers: (u: User[]) => void,
    loadMoreUsers: () => Promise<void>,
    userIdsIndexRef: MutableRefObject<number>,
    scrollHeightRef: MutableRefObject<number>,
    loadUsers: () => void,
    userIdsLoaded: boolean,
    userFirstDatasLoaded: boolean,
    addUserView: (id: number) => void
}

export const ViewContext: React.Context<ViewContextType> = createContext(null);

export function useViewContext() {
    return (useContext(ViewContext))
}

export default function ViewsProvider({ children }: { children: ReactNode }) {

    const [viewUsers, setViewUsers] = useState<User[]>([]);

    const [userIdsLoaded, setUserIdsLoaded] = useState(false);
    const [userFirstDatasLoaded, setUserFirstDatasLoaded] = useState(false);

    const userIdsRef = useRef([]);
    const userIdsIndexRef = useRef(20);

    const scrollHeightRef = useRef(0);



    async function loadUsersDatas(userIds: number[]) {
        try {
            if (userIds && userIds.length) {
                for (let id of userIds) {
                    await addUserView(id);
                }
            }
        }
        catch (e) {
            // console.log(e)
        }
    }


    async function loadMoreUsers() {
        const userIds = userIdsRef.current.slice(userIdsIndexRef.current, userIdsIndexRef.current + 20)
        userIdsIndexRef.current += 20;
        await loadUsersDatas(userIds)
    }

    const loadUsers = useCallback(async () => {
        let userIds = userIdsRef.current;

        setViewUsers([]);
        if (userIds && userIds.length) {
            userIds = userIds.slice(0, 20);
            loadUsersDatas(userIds);
            setUserFirstDatasLoaded(true)
        }
        return (userIds)
    }, [userIdsRef.current])

    async function loadUserIds() {
        userIdsRef.current = await getUserViews()
            .then(async (res: AxiosResponse) => res.data.userIds)
            .catch(err => { })
        setUserIdsLoaded(true)
    }


    async function addUserView(id: number) {
        let user: User;
        try {
            await getUserRequest(id)
                .then(res => {
                    user = res.data.user;
                    setViewUsers((users: User[]) => [...users, res.data.user])
                    if (user && Number(user.nbPhotos)) {
                        getUserPhotoRequest(0, Number(id), 400)
                            .then(res => {
                                const photos = [{ index: 0, url: window.URL.createObjectURL(res.data) }]
                                setViewUsers((_users: User[]) =>
                                    _users.map((u: User) => u.userId === id ? ({ ...u, photos }) : u)
                                )
                            })
                            .catch(err => { })
                    }
                })
        }
        catch (e) {
            // console.log(e)
        }
    }

    useEffect(() => {
        loadUserIds()
    }, [])

    return (
        <ViewContext.Provider
            value={{
                userIdsRef,
                viewUsers,
                setViewUsers,
                loadMoreUsers,
                userIdsIndexRef,
                scrollHeightRef,
                loadUsers,
                userIdsLoaded,
                userFirstDatasLoaded,
                addUserView
            }}
        >
            {children}
        </ViewContext.Provider>
    )
}



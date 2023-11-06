import { MutableRefObject, ReactNode, createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getUserLikes, getUserPhotoRequest, getUserRequest, getUserViews } from "../requests";
import { User } from "../types";
import { AxiosResponse } from "axios";


type LikesContextType = {
    userIdsRef: MutableRefObject<number[]>,
    likesUsers: User[],
    setlikesUsers: (u: User[]) => void,
    loadMoreUsers: () => void,
    userIdsIndexRef: MutableRefObject<number>,
    scrollHeightRef: MutableRefObject<number>,
    loadUsers: () => Promise<number[]>,
    userIdsLoaded: boolean,
    userFirstDatasLoaded: boolean,
    addUserLike: (id: number, addIn?: boolean) => void,
    removeUserLike: (id: number) => void
}


export const LikesContext: React.Context<LikesContextType> = createContext(null);

export function useLikesContext() {
    return (useContext(LikesContext))
}

export default function LikesProvider({ children }: { children: ReactNode }) {

    const [likesUsers, setlikesUsers] = useState([]);

    const [userIdsLoaded, setUserIdsLoaded] = useState(false);
    const [userFirstDatasLoaded, setUserFirstDatasLoaded] = useState(false);

    const userIdsRef = useRef([]);
    const userIdsIndexRef = useRef(20);
    const scrollHeightRef = useRef(0);

    async function loadUsersDatas(userIds: number[]) {
        try {
            if (userIds && userIds.length) {
                for (let id of userIds) {
                    await addUserLike(id)
                }
            }
        }
        catch (e) {
            // console.log(e)
        }
    }

    async function addUserLike(id: number, addInUserIds: boolean = false) {
        if (addInUserIds)
            userIdsRef.current.push(id)
        let user: User;
        try {
            await getUserRequest(id)
                .then(res => {
                    user = res.data.user;
                    setlikesUsers((users: User[]) => [...users, res.data.user])
                    if (user && Number(user.nbPhotos)) {
                        getUserPhotoRequest(0, Number(id), 400)
                            .then(res => {
                                const photos = [{ index: 0, url: window.URL.createObjectURL(res.data) }]
                                setlikesUsers((_users: User[]) =>
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


    async function loadMoreUsers() {
        const userIds = userIdsRef.current.slice(userIdsIndexRef.current, userIdsIndexRef.current + 20)
        userIdsIndexRef.current += 20;
        await loadUsersDatas(userIds)
    }

    const loadUsers = useCallback(async () => {
        let userIds = userIdsRef.current;

        setlikesUsers([]);
        if (userIds && userIds.length) {
            userIds = userIds.slice(0, 20);
            loadUsersDatas(userIds);
            setUserFirstDatasLoaded(true)
        }
        return (userIds)
    }, [userIdsRef.current])

    async function loadUserIds() {
        userIdsRef.current = await getUserLikes()
            .then(async (res: AxiosResponse) => res.data.userIds)
            .catch(err => { })
        setUserIdsLoaded(true)
    }

    async function removeUserLike(id: number) {
        setlikesUsers((users: User[]) => users.filter((u: User) => Number(u.userId) !== Number(id)))
        userIdsRef.current = userIdsRef.current.filter((uid: string) => parseInt(uid) !== Number(id))
    }

    useEffect(() => {
        loadUserIds()
    }, [])

    return (
        <LikesContext.Provider
            value={{
                userIdsRef,
                likesUsers,
                setlikesUsers,
                loadMoreUsers,
                userIdsIndexRef,
                scrollHeightRef,
                loadUsers,
                userIdsLoaded,
                userFirstDatasLoaded,
                addUserLike,
                removeUserLike
            }}
        >
            {children}
        </LikesContext.Provider>
    )
}



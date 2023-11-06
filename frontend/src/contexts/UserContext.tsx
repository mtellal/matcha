import { MutableRefObject, createContext, useContext, useEffect, useRef, useState } from "react";
import { getUserPhotoRequest, getUserTagsRequest } from "../requests";
import { User } from "../types";
import { AxiosError, AxiosResponse } from "axios";


export type TCurrentUser = {
    currentUser: User
    setCurrentUser: (u: User | ((u: User) => User)) => void
    addBlockUserId: (id: number) => void,
    removeBlockUserId: (id: number) => void,
    userPhotosLoadedRef: MutableRefObject<boolean>
}

const UserContext: React.Context<TCurrentUser> = createContext(null)

export function useCurrentUser() {
    return (useContext(UserContext))
}

type UserProviderProps = {
    children: React.ReactNode,
    _user: User
}

export function UserProvider({ children, _user }: UserProviderProps) {

    const [currentUser, setCurrentUser] = useState<Partial<User>>({
        blockIds: []
    });
    const userPhotosLoadedRef = useRef(false)

    async function loadTags() {
        await getUserTagsRequest()
            .then((res: AxiosResponse) => {
                setCurrentUser((u: User) => ({ ...u, tags: res.data.tags }));
            })
            .catch((err: AxiosError) => { })
    }

    async function loadUserPhotos(u: User) {
        if (u.photosIndex && u.photosIndex) {
            for (let index of u.photosIndex) {
                await getUserPhotoRequest(index, null, 400)
                    .then(res => {
                        if (res && res.data) {
                            setCurrentUser((u: User) => ({
                                ...u,
                                photos: [...u.photos, { index, url: window.URL.createObjectURL(new Blob([res.data])) }]
                            }))
                        }
                    })
                    .catch(err => { })
            }
        }
        userPhotosLoadedRef.current = true;
    }


    useEffect(() => {
        if (_user) {
            setCurrentUser((u: User) => ({ ...u, ..._user }));
            loadTags();
            loadUserPhotos(_user);
        }
    }, [_user])

    function addBlockUserId(blockUserId: number) {
        setCurrentUser((u: User) => ({ ...u, blockIds: u.blockIds && u.blockIds.length ? [...u.blockIds, blockUserId] : [blockUserId] }))
    }

    function removeBlockUserId(blockUserId: number) {
        setCurrentUser((u: User) => ({ ...u, blockIds: u.blockIds.filter((id: number) => id !== blockUserId) }))
    }

    return (
        <UserContext.Provider value={{
            currentUser: currentUser as User,
            setCurrentUser,
            addBlockUserId,
            removeBlockUserId,
            userPhotosLoadedRef
        }}>
            {children}
        </UserContext.Provider>
    )
}
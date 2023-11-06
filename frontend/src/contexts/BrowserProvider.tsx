import { Dispatch, MutableRefObject, ReactNode, createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getAdvancedBrowseUsersRequest, getBrowseUsersRequest, getUserAdavancedOptionsRequest, getUserPhotoRequest, getUserRequest } from "../requests";
import { AdvancedOptions, City, User } from "../types";
import { AxiosResponse } from "axios";

type BrowserContextType = {
    userIdsRef: MutableRefObject<number[]>,
    browseUsers: User[],
    browseDispatch: Dispatch<any>,
    filterIds: number[],
    setFilterIds: (f: number[]) => void,
    loadUsersAdvanced: (opts: AdvancedOptions) => void,
    loadMoreUsers: () => void,
    filterConfigRef: any,
    sortConfigRef: any,
    searchConfigRef: any,
    scrollHeightRef: MutableRefObject<number>
}

export const BrowserContext: React.Context<BrowserContextType> = createContext(null);

export function useBrowserContext() {
    return (useContext(BrowserContext))
}

export function browserReducer(browseUsers: User[], action: any) {
    switch (action.type) {
        case ('browseUsers'): {
            if (action.browseUsers && typeof action.browseUsers === "object")
                return (action.browseUsers)
        }
        case ('resetOriginal'): {
            if (action.userIds && action.userIds.length) {
                return (
                    action.userIds.map((id: number) => browseUsers.find((u: User) => u.userId === id))
                )
            }
        }
        case ('addUser'): {
            if (action.user)
                return ([...browseUsers, action.user])
        }
        case ('removeUsers'): {
            return ([]);
        }
        case ('addUserPhotos'): {
            if (action.data && action.userId) {
                return (
                    browseUsers.map((u: User) => {
                        if (Number(u.userId) === parseInt(action.userId)) {
                            return ({ ...u, photos: [{ index: 0, url: window.URL.createObjectURL(action.data) }] })
                        }
                        else return (u)
                    })
                )
            }
        }
        case ('sortYounger'): {
            return (
                [...browseUsers.sort((u1: User, u2: User) => parseInt(u1.age) - parseInt(u2.age))]
            )
        }
        case ('sortOlder'): {
            return (
                [...browseUsers.sort((u1: User, u2: User) => parseInt(u2.age) - parseInt(u1.age))]
            )
        }
        default: return browseUsers;
    }
}


export default function BrowserProvider({ children }: { children: ReactNode }) {

    const [browseUsers, browseDispatch] = useReducer(browserReducer, []);
    const [filterIds, setFilterIds] = useState([]);


    const filterConfigRef = useRef();
    const sortConfigRef = useRef();
    const searchConfigRef = useRef();

    const userIdsRef = useRef([]);
    const userIdsIndexRef = useRef(20);
    const advancedOptionsRef = useRef<AdvancedOptions>(null);

    const scrollHeightRef = useRef(0);


    async function loadUsersDatas(userIds: number[], advancedOptions: AdvancedOptions) {
        try {
            if (userIds && userIds.length) {
                for (let id of userIds) {
                    try {
                        let res;
                        if (advancedOptions && advancedOptions.city)
                            res = await getUserAdavancedOptionsRequest(id, advancedOptions)
                        else
                            res = await getUserRequest(id)
                        let user = res.data.user;
                        browseDispatch({ type: 'addUser', user: user })
                        if (user && parseInt(user.nbPhotos)) {
                            getUserPhotoRequest(0, Number(id), 400)
                                .then(res => {
                                    browseDispatch({ type: 'addUserPhotos', data: res.data, userId: id })
                                })
                                .catch(err => { })
                        }
                    }
                    catch (e) {
                        // console.log(e)
                    }
                }
            }
        }
        catch (e) {
            // console.log(e)
        }
    }


    async function loadMoreUsers() {
        if (userIdsRef.current && userIdsRef.current.length) {
            const userIds = userIdsRef.current.slice(userIdsIndexRef.current, userIdsIndexRef.current + 20)
            userIdsIndexRef.current += 20;
            await loadUsersDatas(userIds, advancedOptionsRef.current)
        }
    }

    async function loadUsers() {
        advancedOptionsRef.current = null;
        userIdsIndexRef.current = 20;

        let userIds = await getBrowseUsersRequest()
            .then(async (res: AxiosResponse) => res.data.users)
            .catch(err => { })

        browseDispatch({ type: 'removeUsers' })
        userIdsRef.current = userIds
        if (userIds && userIds.length) {
            userIds = userIds.slice(0, 20);
            loadUsersDatas(userIds, null);
        }
        return (userIds)
    }

    async function loadUsersAdvanced(advancedOptions: AdvancedOptions) {
        advancedOptionsRef.current = advancedOptions
        userIdsIndexRef.current = 20;


        let userIds = await getAdvancedBrowseUsersRequest(advancedOptions)
            .then(async (res: AxiosResponse) => res.data.users)
            .catch(err => { })
        browseDispatch({ type: 'removeUsers' })
        userIdsRef.current = userIds
        if (userIds && userIds.length) {
            userIds = userIds.slice(0, 20);
            loadUsersDatas(userIds, advancedOptions);
        }
        return (userIds)
    }

    useEffect(() => {
        loadUsers();
    }, [])

    return (
        <BrowserContext.Provider
            value={{
                userIdsRef,
                browseUsers,
                browseDispatch,
                filterIds,
                setFilterIds,
                loadUsersAdvanced,
                loadMoreUsers,
                filterConfigRef,
                sortConfigRef,
                searchConfigRef,
                scrollHeightRef
            }}
        >
            {children}
        </BrowserContext.Provider>
    )
}



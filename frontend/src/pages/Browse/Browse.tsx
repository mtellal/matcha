import React, { useCallback, useEffect, useRef } from "react";

import './Browse.css'

import { useBrowserContext } from "../../contexts/BrowserProvider";
import BrowseUsersList from "./BrowseUsersList/BrowseUsersList";
import TagsPickerPage from "../../components/TagsPickerPage/TagsPickerPage";
import { useCurrentUser } from "../../contexts/UserContext";



export default function Browse() {

    const { currentUser } = useCurrentUser();
    const { loadUsers, loadMoreUsers, scrollHeightRef } = useBrowserContext();

    const usersContainerRef: React.MutableRefObject<HTMLDivElement> = useRef(null);

    const loadingUsers = useRef(false);
    const scrollInitRef = useRef(false);

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    useEffect(() => {
        if (!scrollInitRef.current && scrollHeightRef.current && usersContainerRef.current) {
            usersContainerRef.current.scrollTop = scrollHeightRef.current;
        }
    }, [scrollHeightRef, usersContainerRef, scrollInitRef])

    const handleScroll = useCallback(async (e: any) => {
        scrollHeightRef.current = e.target.scrollTop;
        if (!loadingUsers.current &&
            e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50) {
            loadingUsers.current = true;
            await loadMoreUsers();
            loadingUsers.current = false;
        }
    }, [loadMoreUsers, scrollHeightRef])

    useEffect(() => {
        const current = usersContainerRef.current 
        if (current)
            current.addEventListener('scroll', handleScroll)
        return () => {
            if (current)
                current.removeEventListener('scroll', handleScroll);
        }
    }, [usersContainerRef, handleScroll])


    return (
        <div
            className="browse">
            <TagsPickerPage>
                <div ref={usersContainerRef} className="browse-users">
                    <BrowseUsersList
                        currentUser={currentUser}
                    />
                </div>

            </TagsPickerPage>
        </div>
    )
}

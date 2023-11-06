import React, { useEffect, useRef, useState } from "react";

import './Browse.css'

import useWindowDimensions from "../../hooks/useWindowDimensions";
import paramsIcon from '../../assets/Params.svg'

import { useBrowserContext } from "../../contexts/BrowserProvider";
import BrowseUsersList from "./BrowseUsersList/BrowseUsersList";
import BrowserMenu from "./BrowserMenu/BrowserMenu";
import TagsPickerPage, { useTagsPage } from "../../components/TagsPickerPage/TagsPickerPage";
import { useCurrentUser } from "../../contexts/UserContext";
import { useOutsideComponent } from "../../hooks/useOutsideComponent";
import { User } from "../../types";


type MobileMenuProps = {
    user: User,
    showMenu: boolean,
    setShowMenu: (s: boolean | ((b: boolean) => boolean)) => void
}

function MobileMenu({ user, showMenu, setShowMenu }: MobileMenuProps) {

    const { showTagsPage } = useTagsPage();

    const mobileMenuRef = useRef();

    useOutsideComponent(mobileMenuRef, () => {
        if (!showTagsPage && setShowMenu)
            setShowMenu(false)
    }, [showTagsPage])

    return (
        <div className="browse-menus">
            <div className="browse-menus-c" ref={mobileMenuRef}>
                {
                    showMenu &&
                    <img
                        className="browse-slidemenu-img"
                        src={paramsIcon}
                        onClick={() => setShowMenu((b: boolean) => !b)}
                    />
                }
                <BrowserMenu user={user} />
            </div>
        </div>
    )
}


export default function Browse() {

    const { currentUser } = useCurrentUser();
    const { loadMoreUsers, scrollHeightRef } = useBrowserContext();

    const { width } = useWindowDimensions();
    const [showMenu, setShowMenu] = useState(false);

    const usersContainerRef: React.MutableRefObject<HTMLDivElement> = useRef();

    const loadingUsers = useRef(false);
    const scrollInitRef = useRef(false);

    useEffect(() => {
        if (!scrollInitRef.current && scrollHeightRef.current && usersContainerRef.current) {
            usersContainerRef.current.scrollTop = scrollHeightRef.current;
        }
    }, [scrollHeightRef.current, usersContainerRef.current])

    async function handleScroll(e: any) {
        scrollHeightRef.current = e.target.scrollTop;
        if (!loadingUsers.current &&
            e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50) {
            loadingUsers.current = true;
            await loadMoreUsers();
            loadingUsers.current = false;
        }
    }

    useEffect(() => {
        if (usersContainerRef.current)
            usersContainerRef.current.addEventListener('scroll', handleScroll)
        return () => {
            if (usersContainerRef.current)
                usersContainerRef.current.removeEventListener('scroll', handleScroll);
        }
    }, [usersContainerRef.current])


    return (
        <div className="browse" style={{ position: 'relative' }}>
            <TagsPickerPage>
                <div ref={usersContainerRef} className="browse-users">
                    <BrowseUsersList />
                </div>
                {
                    width < 1150 && !showMenu &&
                    <div className="browse-slidemenu">
                        <img
                            className="browse-slidemenu-img"
                            src={paramsIcon}
                            onClick={() => setShowMenu((b: boolean) => !b)}
                        />
                    </div>
                }
                {
                    (width >= 1150 || (showMenu)) &&
                    <MobileMenu
                        user={currentUser}
                        showMenu={showMenu}
                        setShowMenu={setShowMenu}
                    />
                }
            </TagsPickerPage>
        </div>
    )
}

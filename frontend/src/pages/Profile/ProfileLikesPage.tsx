import { useCallback, useEffect, useRef } from "react";
import { useLikesContext } from "../../contexts/LikesProvider";
import { UsersList } from "../../components/UsersList/UsersList";

export default function ProfileLikesPage() {
    const {
        userIdsRef,
        likesUsers,
        loadMoreUsers,
        scrollHeightRef,
        loadUsers,
        userIdsLoaded,
        userFirstDatasLoaded
    } = useLikesContext();


    const usersContainerRef: React.MutableRefObject<HTMLDivElement> = useRef(null);
    const loadingUsers = useRef(false);
    const scrollInitRef = useRef(false);

    useEffect(() => {
        if (userIdsLoaded && !userFirstDatasLoaded)
            loadUsers()
    }, [userIdsLoaded, userFirstDatasLoaded, loadUsers])


    useEffect(() => {
        if (!scrollInitRef.current && scrollHeightRef.current && usersContainerRef.current) {
            usersContainerRef.current.scrollTop = scrollHeightRef.current;
        }
    }, [scrollHeightRef, usersContainerRef])


    const handleScroll = useCallback(async (e: any) => {
        scrollHeightRef.current = e.target.scrollTop;
        if (!loadingUsers.current &&
            e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50) {
            loadingUsers.current = true;
            await loadMoreUsers();
            loadingUsers.current = false;
        }
    }, [scrollHeightRef, loadMoreUsers])

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
        <UsersList
            title="Likes"
            usersContainerRef={usersContainerRef}
            userIdsRef={userIdsRef}
            users={likesUsers}
        />
    )
}

import { useEffect, useRef } from "react";
import { UserCart } from "../../../../components/Label/UserCart/UserCart";
import { useLikesContext } from "../../../../contexts/LikesProvider";
import { UsersList } from "../../../../components/UsersList/UsersList";

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


    const usersContainerRef: React.MutableRefObject<HTMLDivElement> = useRef();
    const loadingUsers = useRef(false);
    const scrollInitRef = useRef(false);

    useEffect(() => {
        if (userIdsLoaded && !userFirstDatasLoaded)
            loadUsers()
    }, [userIdsLoaded, userFirstDatasLoaded])


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
        <UsersList
            title="Likes"
            usersContainerRef={usersContainerRef}
            userIdsRef={userIdsRef}
            users={likesUsers}
        />
    )
}

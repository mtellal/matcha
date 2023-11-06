import { useBrowserContext } from "../../../contexts/BrowserProvider";
import { UserCart } from "../../../components/Label/UserCart/UserCart";
import './BrowseUsersList.css'
import { User } from "../../../types";

export default function BrowseUsersList() {

    const { browseUsers, filterIds, userIdsRef } = useBrowserContext();

    return (
        <div className='brwuserl-users-c'>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="userscollection-title brwuserl-title">Recommanded Users</h1>
                <p className="font-14 brwuserl-nbusers" >{userIdsRef.current && userIdsRef.current.length} users found</p>
            </div>
            <div className="brwuserl-users">
                {
                    browseUsers && browseUsers
                        .filter((u: User) => !filterIds.find((id: number) => id === u.userId))
                        .map((u: User) =>
                            <UserCart key={u.userId} user={u} profilePicture={u && u.photos && u.photos.length ? u.photos[0].url : null} />
                        )
                }
            </div>
        </div>
    )
}
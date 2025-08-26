import { useBrowserContext } from "../../../contexts/BrowserProvider";
import { UserCart } from "../../../components/Label/UserCart/UserCart";
import './BrowseUsersList.css'
import { User } from "../../../types";
import MenuFilter from "../BrowserMenu/MenuFilter";
import MenuFilterSearch from "../BrowserMenu/MenuFilterSearch";
import MenuSort from "../BrowserMenu/Sort";
import '../BrowserMenu/BrowserMenu.css'

export default function BrowseUsersList({ currentUser }: any) {

    const { browseUsers, filterIds, userIdsRef } = useBrowserContext();
    
    return (
        <div className='brwuserl-users-c'>
            <div className="browsermenu">
                <MenuFilterSearch title="Advanced Search" user={currentUser} />
                <MenuFilter title="Filter" />
                <MenuSort title="Sort" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', padding: '15px 0', justifyContent: 'space-between' }}>
                <h1 className="userscollection-title brwuserl-title" style={{ alignSelf: 'center', height: '100%', margin: '0', fontWeight: '500', fontSize: '14' }}>Recommanded Users</h1>
                <p className="font-14" style={{ alignSelf: 'center', height: '100%', fontWeight: '400', fontSize: '13px' }}>{userIdsRef.current && userIdsRef.current.length} users found</p>
            </div>
            {
                browseUsers.length > 0 ?
                    <div className="brwuserl-users">
                        {
                            browseUsers
                                .filter((u: User) => !filterIds.find((id: number) => id === u.userId))
                                .map((u: User) =>
                                    <UserCart key={u.userId} user={u} />
                                )
                        }
                    </div>
                    :
                    <div style={{
                        width: '4fr', height: '100%', display: 'flex', justifyContent: 'center',
                        alignItems: 'center', background: 'var(--blue2)', borderRadius: '10px'
                    }}>
                        <div id="heart"></div>
                    </div>
            }
        </div>
    )
}
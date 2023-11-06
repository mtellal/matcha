import { RefObject } from "react"
import { UserCart } from "../Label/UserCart/UserCart"

import './UsersList.css'
import { User } from "../../types"

type UsersListProps = {
    title: string, 
    usersContainerRef: RefObject<any>,
    userIdsRef: RefObject<number[]>,
    users: User[]
}

export function UsersList({ title, usersContainerRef, userIdsRef, users }: UsersListProps) {
    return (
        <div className="userslist" ref={usersContainerRef}>
            <div className='userslist-users-c'>
                <div className="userslist-users-c1">
                    <h1 className="userscollection-title" style={{ margin: '0 0 20px 0', color: 'white' }}>{title}</h1>
                    <p className="font-14" style={{ paddingBottom: '5px' }}>{userIdsRef.current && userIdsRef.current.length} users found</p>
                </div>
                {
                    !userIdsRef.current || !userIdsRef.current.length ?
                        <p className="userslist-no-users">No users found</p> :
                        <div className="userslist-users">
                            {
                                users && users
                                    .map((u: any) =>
                                        <UserCart
                                            key={u.userId}
                                            user={u}
                                            profilePicture={u && u.photos && u.photos.length ? u.photos[0].url : null}
                                        />
                                    )
                            }
                        </div>
                }
            </div>
        </div>
    )
}
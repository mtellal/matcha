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
            <div className='userslist-users-c' style={!userIdsRef.current || !userIdsRef.current.length ? {height:'auto'} : {}}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', padding: '15px 0', justifyContent: 'space-between', width: '100%' }}>
                    <h1 className="userscollection-title brwuserl-title" style={{ alignSelf: 'center', height: '100%', margin: '0', fontWeight: '500', fontSize: '14' }}>{title}</h1>
                    <p className="font-14" style={{ alignSelf: 'center', height: '100%', fontWeight: '400', fontSize: '13px' }}>{userIdsRef.current && userIdsRef.current.length} users found</p>
                </div>
                {
                    !userIdsRef.current || !userIdsRef.current.length ?
                        <div style={{display: 'flex', justifyContent:'center', alignItems: 'center', height: '100%', width: '100%'}}>
                            <p className="userslist-no-users">No users found</p>
                        </div>
                        :
                        <div className="userslist-users">
                            {
                                users && users
                                    .map((u: any) =>
                                        <UserCart
                                            key={u.userId}
                                            user={u}
                                        />
                                    )
                            }
                        </div>
                }
            </div>
        </div>
    )
}
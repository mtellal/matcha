import { UserCart } from '../../components/Label/UserCart/UserCart'
import { User } from '../../types'

import './UsersCollection.css'

type TUsersCollection = {
    title: string,
    users: User[]
}

export default function UsersCollection(props: TUsersCollection) {
    return (
        <div className="userscollection">
            <div className="userscollection-c">
                <h1 className="userscollection-title">{props.title}</h1>
                <div className="userscollection-users-c">
                    {
                        props.users.map((o: any) =>
                            <UserCart
                                key={o.id || o.userId}
                                user={o}
                                profilePicture={o.photos && o.photos[0] ? o.photos[0].url : null}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}
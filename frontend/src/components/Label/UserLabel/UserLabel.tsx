import { ProfilePicture } from "../../ProfilePicture/ProfilePicture";

import './UserLabel.css'
import { User } from "../../../types";

type UserLabelProps = {
    user: User
    message?: string,
    onClick?: () => void
}

export default function UserLabel({ user, message, onClick }: UserLabelProps) {

    // conversation store => update user profile picture 
    // dissociate conv users and search users

    return (
        <div className="userlabel"
            onClick={onClick}
        >
            <div className="userlabel-pp-c">
                <ProfilePicture
                    userId={user && user.userId}
                    url={user && user.photos && user.photos[0].url}
                    style={{ height: '80%' }}
                />
                <div className="userlabel-status" />
            </div>
            <div className="userlabel-infos">
                <div className="usrlabel-usrinfos">
                    <p className="userlabel-infos-username" style={{ fontSize: '16px' }}>{user && user.firstName}</p>
                </div>
                <p className="userlabel-infos-msg" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{message || "no messages"}</p>
            </div>
        </div>
    )
}
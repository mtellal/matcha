import { ProfilePicture } from "../../ProfilePicture/ProfilePicture";

import './UserLabel.css'
import { getUserAge } from "../../../utils";
import { User } from "../../../types";

type UserLabelProps = {
    user: User
    message?: string,
    onClick?: () => void
}

export default function UserLabel({ user, message, onClick }: UserLabelProps) {
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
                    <p className="userlabel-infos-username">{user && user.firstName}, </p>
                    <p className="usrlabel-font-18">{user && getUserAge(user.age)} - </p>
                    <p className="usrlabel-font-16">{user && user.city && user.city.name}</p>
                    <p className="usrlabel-font-16">{user && user.department && user.department.name}</p>
                </div>
                <p className="userlabel-infos-msg">{message || "no messages"}</p>
            </div>
        </div>
    )
}
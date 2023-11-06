
import './ProfileInfos.css'

import HeartBorder from '../../../assets/Heart_Border.svg';
import eyeIcon from '../../../assets/eye.svg';
import starIcon from '../../../assets/Star.svg';
import ProfileInfosUser from "./ProfileInfosUser/ProfileInfosUser";
import ProfileInfosUserEdit from "./ProfileInfosUserEdit/ProfileInfosUserEdit";
import { User } from '../../../types';

type ProfileInfosProps = {
    user?: User,
    isCurrentUser?: boolean,
    editing?: boolean,
    setUser?: (u: User | ((u: User) => User)) => void,
    setError?: (e: string) => void
}


export default function ProfileInfos(props: ProfileInfosProps) {

    function convertDate(inputISOString: string) {
        const inputDate = new Date(inputISOString);
        const year = inputDate.getFullYear().toString().slice(-2);
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        const day = inputDate.getDate().toString().padStart(2, '0');
        const hours = inputDate.getHours().toString().padStart(2, '0');
        const minutes = inputDate.getMinutes().toString().padStart(2, '0');
        const seconds = inputDate.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return (
        <div className="profileinfos">
            {
                props.editing ?
                    <ProfileInfosUserEdit user={props.user} setUser={props.setUser} /> :
                    <ProfileInfosUser user={props.user} isCurrentUser={props.isCurrentUser} />
            }

            <div className="profileinfos-infos">
                <img src={HeartBorder} className="profileinfos-infos-icon" />
                <p className="profileinfos-name">{props.user && String(props.user.likes)}</p>
            </div>
            <div className="profileinfos-infos">
                <img src={eyeIcon} className="profileinfos-infos-icon" />
                <p className="profileinfos-name">{props.user && String(props.user.views)}</p>
            </div>
            <div className="profileinfos-infos">
                <img src={starIcon} className="profileinfos-infos-icon" />
                <p className="profileinfos-name">
                    {props.user && String(props.user.fameRating)}
                </p>
            </div>
            <div className="profileinfos-infos">
                <div className="profileinfos-infos-icon-status" style={(props.isCurrentUser || props.user?.status) ? { backgroundColor: 'var(--green' } : {}} ></div>
                <p
                    className="profileinfos-name"
                    style={{ textAlign: 'start', whiteSpace: 'pre-line' }}
                >
                    {`${(props.isCurrentUser || props.user?.status) ? "Online" : "Offline"}\n${!props.isCurrentUser && props.user && !props.user.status && props.user.lastConnection ? convertDate(props.user.lastConnection) : ""}`}
                </p>
            </div>
        </div>
    )
}
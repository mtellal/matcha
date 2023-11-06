
import './Header.css'

import heart from '../../assets/Heart_Header.svg'
import { ButtonBorder, ButtonBorderMenu } from "../Buttons/ButtonBorder";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";

import { useLocation, useNavigate } from "react-router";
import { useNotificationContext } from '../../contexts/NotificationsProvider';
import { useCallback } from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import MobileHeaderMenu from './MobileHeaderMenu/MobileHeaderMenu';
import NotificationsMenu from './NotificationsMenu/NotificationsMenu';
import { useCurrentUser } from '../../contexts/UserContext';
import { User } from '../../types';


function UserInfos({ user }: { user: User }) {

    const navigate = useNavigate();

    return (
        <div className="header-c2-user">
            <NotificationsMenu />
            <ProfilePicture
                userId={user && user.userId}
                style={{ height: '50px', width: '50px' }}
                url={user && user.photos && user.photos[0] && user.photos[0].url}
                onClick={() => navigate("/profile")}
            />
            <p className="header-c2-username">{user && user.firstName}</p>
            <ButtonBorder
                style={{ marginLeft: '2vw', padding: '15px' }}
                title="Logout"
                onClick={() => navigate("/signin")}
            />
        </div >
    )
}



export default function HeaderConnected() {

    const { width } = useWindowDimensions();
    const { newNotifChat } = useNotificationContext();

    const { currentUser } = useCurrentUser();

    const navigate = useNavigate();
    const location = useLocation();

    const onClick = useCallback((path: string) => {
        const pathName = location.pathname;
        if (path === "/chat" && !pathName.startsWith("/chat")) {
            navigate(path);
        }
        else if (path !== pathName)
            navigate(path)
    }, [location.pathname])

    const style = useCallback((pathname: string, value: string) => {
        if (pathname === value) {
            return ({ backgroundColor: 'var(--purple2)' });
        }
        else if (value === "/chat" && newNotifChat) {
            return ({ border: '1px solid white' });
        }
    }, [newNotifChat]);


    const titleClick = useCallback(() => {
        if (location.pathname && location.pathname !== "/")
            navigate("/")
    }, [location.pathname])


    return (
        <header className="header" >
            <div className="header-c1" >
                <img className="header-logo" src={heart} />
                <h2 className="header-name" onClick={titleClick}>Matcha</h2>
            </div>
            {
                width <= 900 ?
                    <MobileHeaderMenu />
                    :
                    <div className="header-menu">
                        <ButtonBorderMenu
                            title="Profile"
                            style={style(location.pathname, "/profile")}
                            onClick={() => onClick("/profile")} />
                        <ButtonBorderMenu
                            title="Browse"
                            style={style(location.pathname, "/browse")} onClick={() => onClick("/browse")} />
                        <ButtonBorderMenu
                            title="Chat"
                            notif={newNotifChat}
                            style={style(location.pathname, "/chat")} onClick={() => onClick("/chat")} />
                    </div>
            }
            <UserInfos user={currentUser} />
        </header>
    )
}
